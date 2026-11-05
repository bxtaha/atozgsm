import { db } from "@/lib/db";
import { requirementsFor } from "@/lib/requirements";
import type { ProgramLevel, TeachingLanguage } from "@/lib/universities/types";

export type DocumentStatus = "missing" | "uploaded" | "under-review" | "approved" | "needs-correction";

export interface Profile {
  studyLevel: ProgramLevel | null;
  subject: string | null;
  intake: string | null;
  currentQualification: string | null;
  studyLanguage: TeachingLanguage | null;
  onboardedAt: string | null;
}

export interface StoredDocument {
  id: string;
  requirementId: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  sizeBytes: number;
  status: DocumentStatus;
  reviewerNote: string | null;
  uploadedAt: string;
}

export function getProfile(userId: string): Profile {
  const row = db()
    .prepare(
      `SELECT study_level, subject, intake, current_qualification, study_language, onboarded_at
       FROM profiles WHERE user_id = ?`,
    )
    .get(userId) as Record<string, string | null> | undefined;

  return {
    studyLevel: (row?.study_level as ProgramLevel) ?? null,
    subject: row?.subject ?? null,
    intake: row?.intake ?? null,
    currentQualification: row?.current_qualification ?? null,
    studyLanguage: (row?.study_language as TeachingLanguage) ?? null,
    onboardedAt: row?.onboarded_at ?? null,
  };
}

export function getDocuments(userId: string): StoredDocument[] {
  const rows = db()
    .prepare(
      `SELECT id, requirement_id, original_name, stored_name, mime_type, size_bytes, status, reviewer_note, uploaded_at
       FROM documents WHERE user_id = ? ORDER BY uploaded_at DESC`,
    )
    .all(userId) as Record<string, string | number>[];

  return rows.map((r) => ({
    id: r.id as string,
    requirementId: r.requirement_id as string,
    originalName: r.original_name as string,
    storedName: r.stored_name as string,
    mimeType: r.mime_type as string,
    sizeBytes: r.size_bytes as number,
    status: r.status as DocumentStatus,
    reviewerNote: (r.reviewer_note as string) ?? null,
    uploadedAt: r.uploaded_at as string,
  }));
}

export interface Readiness {
  percent: number;
  completed: number;
  total: number;
  /** Required items with nothing uploaded, most important first. */
  missing: { id: string; label: string }[];
}

/**
 * Readiness counts required documents only. Optional ones can't drag the score
 * down — a student who doesn't need a research proposal shouldn't look 90% ready
 * instead of 100%.
 */
export function calculateReadiness(profile: Profile, documents: StoredDocument[]): Readiness {
  const required = requirementsFor({
    level: profile.studyLevel,
    language: profile.studyLanguage,
  }).filter((r) => !r.optional);

  const byRequirement = new Map(documents.map((d) => [d.requirementId, d]));

  const completed = required.filter((r) => {
    const doc = byRequirement.get(r.id);
    return doc && doc.status !== "needs-correction";
  });

  const missing = required
    .filter((r) => {
      const doc = byRequirement.get(r.id);
      return !doc || doc.status === "needs-correction";
    })
    .map((r) => ({ id: r.id, label: r.label }));

  const total = required.length;
  return {
    percent: total === 0 ? 0 : Math.round((completed.length / total) * 100),
    completed: completed.length,
    total,
    missing,
  };
}
