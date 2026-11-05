import type { Tier } from "@/lib/tier";
import { universities } from "./data";
import type {
  RedactedUniversity,
  University,
  UniversityFilters,
  VisibleUniversity,
} from "./types";

/**
 * Strips every paid field from a university record. Free responses are built
 * from this, so a locked university's name never reaches the browser at all —
 * hiding it in CSS would leave it readable in the page source.
 */
function redact(u: University): RedactedUniversity {
  return {
    id: u.id,
    city: u.city,
    province: u.province,
    category: u.category,
    hostelCnyPerYear: u.hostelCnyPerYear,
    tuitionCnyPerYear: u.tuitionCnyPerYear,
    programs: u.programs,
    scholarshipCount: u.scholarships.length,
    isPlaceholder: u.isPlaceholder,
    locked: true,
  };
}

function forTier(u: University, tier: Tier): VisibleUniversity {
  return tier === "premium" ? { ...u, locked: false } : redact(u);
}

function matches(u: University, f: UniversityFilters): boolean {
  if (f.city && u.city !== f.city) return false;
  if (f.category && u.category !== f.category) return false;
  if (f.level && !u.programs.some((p) => p.level === f.level)) return false;
  if (f.language && !u.programs.some((p) => p.language === f.language)) return false;
  if (f.maxTuition !== undefined && u.tuitionCnyPerYear.min > f.maxTuition) return false;

  if (f.query) {
    const q = f.query.toLowerCase();
    // Free visitors cannot see names, so searching by name would leak which
    // query matched which locked card. Restrict free search to public fields.
    const haystack = [u.city, u.province, ...u.programs.map((p) => p.field)].join(" ").toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  return true;
}

export function searchUniversities(filters: UniversityFilters, tier: Tier): VisibleUniversity[] {
  return universities.filter((u) => matches(u, filters)).map((u) => forTier(u, tier));
}

export function getUniversityBySlug(slug: string, tier: Tier): University | null {
  if (tier !== "premium") return null;
  return universities.find((u) => u.slug === slug) ?? null;
}

export function getCities(): string[] {
  return Array.from(new Set(universities.map((u) => u.city))).sort();
}

export function getProgramFields(): string[] {
  return Array.from(new Set(universities.flatMap((u) => u.programs.map((p) => p.field)))).sort();
}

export function totalUniversityCount(): number {
  return universities.length;
}

export function hasPlaceholderRecords(): boolean {
  return universities.some((u) => u.isPlaceholder);
}
