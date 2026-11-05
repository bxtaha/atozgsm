"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

const OnboardingSchema = z.object({
  studyLevel: z.enum(["bachelor", "master", "diploma", "language"]),
  subject: z.string().trim().max(120).optional(),
  intake: z.string().trim().max(60).optional(),
  currentQualification: z.string().trim().max(60).optional(),
  studyLanguage: z.enum(["english", "chinese", "bilingual"]),
});

export interface OnboardingState {
  error?: string;
}

export async function completeOnboarding(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const user = getCurrentUser();
  if (!user) redirect("/login");

  const parsed = OnboardingSchema.safeParse({
    studyLevel: formData.get("studyLevel"),
    subject: formData.get("subject") || undefined,
    intake: formData.get("intake") || undefined,
    currentQualification: formData.get("currentQualification") || undefined,
    studyLanguage: formData.get("studyLanguage"),
  });

  if (!parsed.success) {
    return { error: "Please choose a study level and a teaching language to continue." };
  }

  const { studyLevel, subject, intake, currentQualification, studyLanguage } = parsed.data;

  db()
    .prepare(
      `UPDATE profiles
       SET study_level = ?, subject = ?, intake = ?, current_qualification = ?, study_language = ?, onboarded_at = ?
       WHERE user_id = ?`,
    )
    .run(
      studyLevel,
      subject ?? null,
      intake ?? null,
      currentQualification ?? null,
      studyLanguage,
      new Date().toISOString(),
      user.id,
    );

  redirect("/dashboard");
}
