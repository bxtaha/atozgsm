"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { getProfile } from "@/lib/profile";
import { requirementById } from "@/lib/requirements";

export interface UploadState {
  error?: string;
  success?: string;
}

const UPLOAD_ROOT = process.env.UPLOAD_DIR ?? join(process.cwd(), ".data", "uploads");

/**
 * Student documents are sensitive (passports, bank statements), so they are
 * written outside `public/` and served only through an authenticated route.
 * Anything under `public/` would be readable by anyone who guessed the URL.
 */
export async function uploadDocument(_prev: UploadState, formData: FormData): Promise<UploadState> {
  const user = getCurrentUser();
  if (!user) redirect("/login");

  const requirementId = String(formData.get("requirementId") ?? "");
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }

  const profile = getProfile(user.id);
  const requirement = requirementById(requirementId, {
    level: profile.studyLevel,
    language: profile.studyLanguage,
  });

  if (!requirement) {
    return { error: "That document isn't part of your checklist." };
  }

  if (!requirement.acceptedMimeTypes.includes(file.type)) {
    const readable = requirement.acceptedMimeTypes
      .map((m) => m.split("/")[1].replace("quicktime", "mov").toUpperCase())
      .join(", ");
    return { error: `This file type isn't accepted for ${requirement.label}. Please upload one of: ${readable}.` };
  }

  const maxBytes = requirement.maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    const actualMb = (file.size / 1024 / 1024).toFixed(1);
    return {
      error: `This file is ${actualMb} MB. The limit for ${requirement.label} is ${requirement.maxSizeMb} MB — try compressing it or scanning at a lower resolution.`,
    };
  }

  // Never trust the client-supplied filename for the path — derive our own.
  const safeExtension = extname(file.name).toLowerCase().replace(/[^a-z0-9.]/g, "").slice(0, 10);
  const storedName = `${randomUUID()}${safeExtension}`;
  const userDir = join(UPLOAD_ROOT, user.id);

  await mkdir(userDir, { recursive: true });
  await writeFile(join(userDir, storedName), Buffer.from(await file.arrayBuffer()));

  const existing = db()
    .prepare("SELECT id, stored_name FROM documents WHERE user_id = ? AND requirement_id = ?")
    .get(user.id, requirementId) as { id: string; stored_name: string } | undefined;

  if (existing) {
    db()
      .prepare(
        `UPDATE documents
         SET original_name = ?, stored_name = ?, mime_type = ?, size_bytes = ?, status = 'uploaded',
             reviewer_note = NULL, uploaded_at = ?
         WHERE id = ?`,
      )
      .run(file.name, storedName, file.type, file.size, new Date().toISOString(), existing.id);

    // Replacing a document: remove the superseded file rather than orphaning it.
    await unlink(join(userDir, existing.stored_name)).catch(() => {});
  } else {
    db()
      .prepare(
        `INSERT INTO documents (id, user_id, requirement_id, original_name, stored_name, mime_type, size_bytes, status, uploaded_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'uploaded', ?)`,
      )
      .run(randomUUID(), user.id, requirementId, file.name, storedName, file.type, file.size, new Date().toISOString());
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/documents");
  return { success: `${requirement.label} uploaded.` };
}

export async function deleteDocument(formData: FormData) {
  const user = getCurrentUser();
  if (!user) redirect("/login");

  const requirementId = String(formData.get("requirementId") ?? "");
  const row = db()
    .prepare("SELECT id, stored_name FROM documents WHERE user_id = ? AND requirement_id = ?")
    .get(user.id, requirementId) as { id: string; stored_name: string } | undefined;

  if (!row) return;

  db().prepare("DELETE FROM documents WHERE id = ?").run(row.id);
  await unlink(join(UPLOAD_ROOT, user.id, row.stored_name)).catch(() => {});

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/documents");
}
