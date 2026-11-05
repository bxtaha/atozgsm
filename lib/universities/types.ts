export type ProgramLevel = "bachelor" | "master" | "diploma" | "language";

export type UniversityCategory = "project-985" | "project-211" | "double-first-class" | "regular";

export type TeachingLanguage = "english" | "chinese" | "bilingual";

export interface Program {
  level: ProgramLevel;
  field: string;
  durationYears: number;
  language: TeachingLanguage;
  tuitionCnyPerYear: number;
}

export interface ScholarshipDetail {
  name: string;
  coverage: string;
  eligibility: string;
  /** Where this information came from, so it can be re-verified. */
  source: string;
  lastVerified: string;
}

export interface University {
  id: string;
  slug: string;
  name: string;
  city: string;
  province: string;
  category: UniversityCategory;
  /** Annual hostel/dormitory cost range in CNY. */
  hostelCnyPerYear: { min: number; max: number };
  tuitionCnyPerYear: { min: number; max: number };
  programs: Program[];
  scholarships: ScholarshipDetail[];
  /** Premium-only written guidance from the ATOZ GSM counselling team. */
  guidance: string;
  officialWebsite: string;
  /** True while this record is sample data and has not been replaced with verified information. */
  isPlaceholder: boolean;
}

/**
 * What a free-tier visitor is allowed to receive. Deliberately omits `name`,
 * `slug`, `officialWebsite`, `scholarships` and `guidance` — those are the
 * paid product, so they must never be serialised into a free response.
 */
export interface RedactedUniversity {
  id: string;
  city: string;
  province: string;
  category: UniversityCategory;
  hostelCnyPerYear: { min: number; max: number };
  tuitionCnyPerYear: { min: number; max: number };
  programs: Program[];
  scholarshipCount: number;
  isPlaceholder: boolean;
  locked: true;
}

export interface UnlockedUniversity extends University {
  locked: false;
}

export type VisibleUniversity = UnlockedUniversity | RedactedUniversity;

/**
 * Explicit guard rather than a bare `u.locked` check: this project compiles with
 * `strictNullChecks: false`, which stops TypeScript narrowing the union by its
 * boolean discriminant on its own.
 */
export const isLocked = (u: VisibleUniversity): u is RedactedUniversity => u.locked === true;

export interface UniversityFilters {
  query?: string;
  city?: string;
  level?: ProgramLevel;
  language?: TeachingLanguage;
  category?: UniversityCategory;
  maxTuition?: number;
}
