"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { canManageCatalog, saveCatalog } from "@/lib/universities/catalog";
import { catalogImport } from "@/lib/universities/catalog-schema";

export async function importUniversities(
  _previous: { error?: string; message?: string },
  form: FormData,
): Promise<{ error?: string; message?: string }> {
  const user = getCurrentUser();
  if (!user || !canManageCatalog(user.id)) return { error: "University admin access is required." };
  const file = form.get("catalogFile");
  const uploaded = file instanceof File && file.size > 0;
  if (uploaded && file.size > 750_000) return { error: "Choose a JSON file under 750 KB." };
  const payload = uploaded ? await file.text() : form.get("catalog");
  const visibility = form.get("visibility");
  if (typeof payload !== "string" || !payload.trim() || (visibility !== "published" && visibility !== "draft")) {
    return { error: "Enter catalog JSON and choose a visibility." };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(payload.replace(/^\uFEFF/, ""));
  } catch {
    return { error: "Enter valid JSON." };
  }
  const result = catalogImport.safeParse(Array.isArray(parsed) ? parsed : [parsed]);
  if (!result.success) {
    const issue = result.error.issues[0];
    return { error: `${issue.path.join(".") || "Catalog"} — ${issue.message}` };
  }
  saveCatalog(result.data, visibility === "published", user.id);
  revalidatePath("/admin/universities");
  revalidatePath("/university");
  revalidatePath("/university/[slug]", "page");
  return { message: `Saved ${result.data.length} ${result.data.length === 1 ? "university" : "universities"}.` };
}
