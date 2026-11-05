import type { ProgramLevel, TeachingLanguage } from "@/lib/universities/types";

/**
 * Who says this document is needed. Students consistently confuse "the
 * university asks for this" with "China requires this", so every requirement
 * carries its origin and it is always shown in the UI.
 */
export type RequirementSource =
  | "our-recommendation"
  | "commonly-required"
  | "programme-dependent"
  | "visa-stage";

export type RequirementCategory = "identity" | "academic" | "language" | "supporting" | "financial";

export interface Requirement {
  id: string;
  label: string;
  category: RequirementCategory;
  source: RequirementSource;
  /** Why this document exists, in plain language. */
  purpose: string;
  /** What makes a submission acceptable. */
  guidance: string;
  acceptedMimeTypes: string[];
  maxSizeMb: number;
  optional?: boolean;
}

export const SOURCE_LABELS: Record<RequirementSource, string> = {
  "our-recommendation": "Our recommendation",
  "commonly-required": "Commonly required",
  "programme-dependent": "Depends on your programme",
  "visa-stage": "Visa stage",
};

export const CATEGORY_LABELS: Record<RequirementCategory, string> = {
  identity: "Identity",
  academic: "Academic",
  language: "Language",
  supporting: "Supporting",
  financial: "Financial",
};

const PDF = "application/pdf";
const IMAGES = ["image/jpeg", "image/png"];
const VIDEO = ["video/mp4", "video/quicktime", "video/webm"];

const BASE: Requirement[] = [
  {
    id: "passport",
    label: "Passport",
    category: "identity",
    source: "commonly-required",
    purpose:
      "Confirms your identity. The name printed here becomes your official name on every application, offer letter and visa document.",
    guidance:
      "Upload the photo page, flat and fully inside the frame, with no glare. Check that your passport will still be valid for your whole study period.",
    acceptedMimeTypes: [PDF, ...IMAGES],
    maxSizeMb: 5,
  },
  {
    id: "passport-photo",
    label: "Passport-size photograph",
    category: "identity",
    source: "commonly-required",
    purpose: "Used on your application and, later, in the visa process.",
    guidance:
      "Universities and the visa process publish exact specifications for size, background colour and how much of the frame your face fills. Check the specification that applies to your application before paying for photos.",
    acceptedMimeTypes: IMAGES,
    maxSizeMb: 2,
  },
];

const ACADEMIC: Record<ProgramLevel, Requirement[]> = {
  bachelor: [
    {
      id: "ssc-certificate",
      label: "SSC certificate",
      category: "academic",
      source: "commonly-required",
      purpose: "Evidence of your secondary education.",
      guidance: "Most universities want this in English. If your original is in Bangla you will need an official translation.",
      acceptedMimeTypes: [PDF, ...IMAGES],
      maxSizeMb: 5,
    },
    {
      id: "ssc-transcript",
      label: "SSC transcript / marksheet",
      category: "academic",
      source: "commonly-required",
      purpose: "Shows your subject-by-subject results, which is what admissions staff actually assess.",
      guidance: "Include every page. A transcript missing pages is the most common reason for a resubmission request.",
      acceptedMimeTypes: [PDF, ...IMAGES],
      maxSizeMb: 5,
    },
    {
      id: "hsc-certificate",
      label: "HSC certificate",
      category: "academic",
      source: "commonly-required",
      purpose: "Evidence of the qualification you are applying on the basis of.",
      guidance:
        "If you have not received the final certificate yet, ask your institution for a provisional certificate and tell us — some universities accept one, others do not.",
      acceptedMimeTypes: [PDF, ...IMAGES],
      maxSizeMb: 5,
    },
    {
      id: "hsc-transcript",
      label: "HSC transcript / marksheet",
      category: "academic",
      source: "commonly-required",
      purpose: "Your detailed results, used to assess your academic standing.",
      guidance: "Include every page, in English or with an official translation.",
      acceptedMimeTypes: [PDF, ...IMAGES],
      maxSizeMb: 5,
    },
  ],
  master: [
    {
      id: "bachelor-certificate",
      label: "Bachelor's certificate",
      category: "academic",
      source: "commonly-required",
      purpose: "Evidence of the degree you are applying on the basis of.",
      guidance: "In English, or with an official translation. Some universities additionally require notarisation.",
      acceptedMimeTypes: [PDF, ...IMAGES],
      maxSizeMb: 5,
    },
    {
      id: "bachelor-transcript",
      label: "Bachelor's transcript",
      category: "academic",
      source: "commonly-required",
      purpose: "Your full academic record, assessed closely for master's admission.",
      guidance: "All years, all pages, in English or officially translated.",
      acceptedMimeTypes: [PDF, ...IMAGES],
      maxSizeMb: 8,
    },
    {
      id: "cv",
      label: "CV / résumé",
      category: "supporting",
      source: "commonly-required",
      purpose: "Summarises your education, work and any research experience.",
      guidance: "Keep it to one or two pages. Lead with education, then relevant experience.",
      acceptedMimeTypes: [PDF],
      maxSizeMb: 3,
    },
    {
      id: "study-plan",
      label: "Study plan / statement of purpose",
      category: "supporting",
      source: "commonly-required",
      purpose:
        "Explains what you want to study and why. For master's applications this is often what separates two similar candidates.",
      guidance:
        "Be specific about the programme you are applying to and why it fits what you have already done. Generic statements that could be sent to any university read as exactly that.",
      acceptedMimeTypes: [PDF],
      maxSizeMb: 3,
    },
    {
      id: "recommendation-letters",
      label: "Recommendation letters",
      category: "supporting",
      source: "commonly-required",
      purpose: "Independent assessment of your ability from someone who taught or supervised you.",
      guidance:
        "Usually two, normally from academic referees, on letterhead and signed. Ask your referees early — this is one of the most common causes of a late application.",
      acceptedMimeTypes: [PDF],
      maxSizeMb: 5,
    },
    {
      id: "research-proposal",
      label: "Research proposal",
      category: "supporting",
      source: "programme-dependent",
      purpose: "Required for research-based programmes and for some scholarships.",
      guidance:
        "Needed only if your programme or scholarship asks for one. Check before spending weeks on it — and check the structure they want.",
      acceptedMimeTypes: [PDF],
      maxSizeMb: 5,
      optional: true,
    },
  ],
  diploma: [
    {
      id: "hsc-certificate",
      label: "HSC / equivalent certificate",
      category: "academic",
      source: "commonly-required",
      purpose: "Evidence of the qualification you are applying on the basis of.",
      guidance: "In English, or with an official translation.",
      acceptedMimeTypes: [PDF, ...IMAGES],
      maxSizeMb: 5,
    },
    {
      id: "hsc-transcript",
      label: "HSC / equivalent transcript",
      category: "academic",
      source: "commonly-required",
      purpose: "Your detailed results.",
      guidance: "Include every page.",
      acceptedMimeTypes: [PDF, ...IMAGES],
      maxSizeMb: 5,
    },
  ],
  language: [
    {
      id: "highest-certificate",
      label: "Highest qualification certificate",
      category: "academic",
      source: "commonly-required",
      purpose: "Shows your most recent completed education.",
      guidance: "In English, or with an official translation.",
      acceptedMimeTypes: [PDF, ...IMAGES],
      maxSizeMb: 5,
    },
  ],
};

const ENGLISH_PROOF: Requirement = {
  id: "english-proficiency",
  label: "English proficiency evidence",
  category: "language",
  source: "programme-dependent",
  purpose: "Shows you can study in English.",
  guidance:
    "IELTS, TOEFL, Duolingo and an MOI certificate are the options that come up most often — but which of these a university accepts varies, and some programmes accept none of them. Confirm what your target university accepts before booking a test.",
  acceptedMimeTypes: [PDF, ...IMAGES],
  maxSizeMb: 5,
};

const HSK: Requirement = {
  id: "hsk-result",
  label: "HSK result",
  category: "language",
  source: "programme-dependent",
  purpose: "Shows your Chinese proficiency for a Chinese-taught programme.",
  guidance:
    "The level required depends on the programme. If you have not sat the HSK yet, tell us — the preparation time changes your whole timeline.",
  acceptedMimeTypes: [PDF, ...IMAGES],
  maxSizeMb: 5,
};

const SUPPORTING: Requirement[] = [
  {
    id: "self-introduction-video",
    label: "Self-introduction video",
    category: "supporting",
    source: "our-recommendation",
    purpose:
      "Not every university asks for one, but a clear self-introduction helps us present you and is requested by some programmes.",
    guidance:
      "Around 90–120 seconds. Introduce yourself, your academic background, why this subject, why China, and what you want to do afterwards. Film in a quiet, well-lit room with your face clearly visible.",
    acceptedMimeTypes: VIDEO,
    maxSizeMb: 100,
    optional: true,
  },
  {
    id: "bank-statement",
    label: "Proof of financial capacity",
    category: "financial",
    source: "visa-stage",
    purpose: "Shows that your tuition and living costs can be covered.",
    guidance:
      "What counts as sufficient, the acceptable format, and how long funds must have been held all vary by university, by your scholarship situation, and by what the visa process requires at the time you apply. Be cautious of any fixed taka figure quoted as 'the requirement' — confirm the amount that applies to your own case.",
    acceptedMimeTypes: [PDF],
    maxSizeMb: 5,
  },
  {
    id: "police-clearance",
    label: "Police clearance certificate",
    category: "supporting",
    source: "visa-stage",
    purpose: "A criminal record check, required at the visa stage for many applicants.",
    guidance: "These take time to obtain in Bangladesh. Start it well before you need it.",
    acceptedMimeTypes: [PDF, ...IMAGES],
    maxSizeMb: 5,
    optional: true,
  },
  {
    id: "medical-certificate",
    label: "Physical examination record",
    category: "supporting",
    source: "visa-stage",
    purpose: "A medical form required as part of the visa process.",
    guidance:
      "It must be completed to the specification required at the time you apply, and these forms have an expiry. Do not complete it too early.",
    acceptedMimeTypes: [PDF, ...IMAGES],
    maxSizeMb: 5,
    optional: true,
  },
];

export interface RequirementContext {
  level?: ProgramLevel | null;
  language?: TeachingLanguage | null;
}

/** Builds the document list that applies to one student's situation. */
export function requirementsFor({ level, language }: RequirementContext): Requirement[] {
  const list = [...BASE];

  if (level) list.push(...ACADEMIC[level]);

  if (language === "chinese") list.push(HSK);
  else if (language === "english") list.push(ENGLISH_PROOF);
  else if (language === "bilingual") list.push(ENGLISH_PROOF, HSK);

  list.push(...SUPPORTING);
  return list;
}

export const requirementById = (id: string, ctx: RequirementContext) =>
  requirementsFor(ctx).find((r) => r.id === id);
