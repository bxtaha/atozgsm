import { describe, expect, it } from "vitest";
import { requirementsFor } from "@/lib/requirements";
import { calculateReadiness, type Profile, type StoredDocument } from "@/lib/profile";

const ids = (ctx: Parameters<typeof requirementsFor>[0]) => requirementsFor(ctx).map((r) => r.id);

describe("dynamic requirements engine", () => {
  it("asks a Chinese-taught applicant for HSK, not English proficiency", () => {
    const list = ids({ level: "bachelor", language: "chinese" });
    expect(list).toContain("hsk-result");
    expect(list).not.toContain("english-proficiency");
  });

  it("asks an English-taught applicant for English proficiency, not HSK", () => {
    const list = ids({ level: "bachelor", language: "english" });
    expect(list).toContain("english-proficiency");
    expect(list).not.toContain("hsk-result");
  });

  it("shows both language paths when the student is undecided", () => {
    const list = ids({ level: "bachelor", language: "bilingual" });
    expect(list).toContain("english-proficiency");
    expect(list).toContain("hsk-result");
  });

  it("gives master's applicants the research-track documents", () => {
    const list = ids({ level: "master", language: "english" });
    expect(list).toEqual(expect.arrayContaining(["bachelor-certificate", "study-plan", "recommendation-letters"]));
    expect(list).not.toContain("ssc-certificate");
  });

  it("gives bachelor's applicants SSC and HSC, not a bachelor's certificate", () => {
    const list = ids({ level: "bachelor", language: "english" });
    expect(list).toEqual(expect.arrayContaining(["ssc-certificate", "hsc-transcript"]));
    expect(list).not.toContain("bachelor-certificate");
  });

  it("always includes identity documents regardless of level", () => {
    for (const level of ["bachelor", "master", "diploma", "language"] as const) {
      expect(ids({ level, language: "english" })).toContain("passport");
    }
  });
});

const profile: Profile = {
  studyLevel: "bachelor",
  subject: null,
  intake: null,
  currentQualification: null,
  studyLanguage: "english",
  onboardedAt: "2026-09-12T00:00:00.000Z",
};

const doc = (requirementId: string, status: StoredDocument["status"] = "uploaded"): StoredDocument => ({
  id: `doc-${requirementId}`,
  requirementId,
  originalName: "file.pdf",
  storedName: "stored.pdf",
  mimeType: "application/pdf",
  sizeBytes: 1000,
  status,
  reviewerNote: null,
  uploadedAt: "2026-09-12T00:00:00.000Z",
});

describe("readiness score", () => {
  it("is 0% with nothing uploaded", () => {
    expect(calculateReadiness(profile, []).percent).toBe(0);
  });

  it("reaches 100% when every required document is uploaded", () => {
    const required = requirementsFor({ level: profile.studyLevel, language: profile.studyLanguage }).filter(
      (r) => !r.optional,
    );
    const readiness = calculateReadiness(profile, required.map((r) => doc(r.id)));
    expect(readiness.percent).toBe(100);
    expect(readiness.missing).toHaveLength(0);
  });

  it("ignores optional documents, so they cannot hold the score below 100%", () => {
    const all = requirementsFor({ level: profile.studyLevel, language: profile.studyLanguage });
    const optional = all.filter((r) => r.optional);
    expect(optional.length).toBeGreaterThan(0);

    const required = all.filter((r) => !r.optional);
    expect(calculateReadiness(profile, required.map((r) => doc(r.id))).percent).toBe(100);
  });

  it("counts a document needing correction as still missing", () => {
    const readiness = calculateReadiness(profile, [doc("passport", "needs-correction")]);
    expect(readiness.missing.map((m) => m.id)).toContain("passport");
    expect(readiness.completed).toBe(0);
  });

  it("lists what is still missing", () => {
    const readiness = calculateReadiness(profile, [doc("passport")]);
    expect(readiness.completed).toBe(1);
    expect(readiness.missing.map((m) => m.id)).not.toContain("passport");
    expect(readiness.missing.length).toBe(readiness.total - 1);
  });
});
