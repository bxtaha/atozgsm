import { levels, type CatalogRecord, type CatalogProgram } from "./catalog-schema";

export type CatalogFilters = { q?: string; city?: string; level?: string; intake?: string; subject?: string; maxTuition?: string; scholarship?: string };

function searchable(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("en").replace(/[’']/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function searchCatalog(records: CatalogRecord[], filters: CatalogFilters) {
  const terms = searchable(filters.q ?? "").split(/\s+/).filter(Boolean);
  const max = filters.maxTuition && /^\d{1,8}$/.test(filters.maxTuition) ? Number(filters.maxTuition) : null;
  const programFilters = Boolean(filters.level || filters.intake || filters.subject || max !== null);
  return records.flatMap((record) => {
    if (filters.city && record.city !== filters.city) return [];
    const universityText = searchable([
      record.name, ...record.aliases, record.city, record.province, record.note,
      ...record.scholarships.flatMap((s) => [s.name, s.type, s.coverage, s.eligibility, s.application, s.renewal]),
    ].filter(Boolean).join(" "));
    const matchesProgram = (p: CatalogProgram) => {
      if (filters.level && p.level !== filters.level) return false;
      if (filters.intake && String(p.intakeMonth) !== filters.intake) return false;
      if (filters.subject && !p.subjects.includes(filters.subject)) return false;
      if (max !== null && (p.tuitionPeriod !== "year" || p.tuitionCny === null || p.tuitionCny > max)) return false;
      const description = searchable([p.name, levels[p.level], p.language, p.duration, p.requirements, p.fees, p.tuitionCny, p.intakeMonth === 3 ? "March spring" : p.intakeMonth === 9 ? "September fall autumn" : null, ...p.subjects].filter(Boolean).join(" "));
      return terms.every((term) => universityText.includes(term) || description.includes(term));
    };
    const programs = record.programs.filter(matchesProgram);
    const awards = record.scholarships.filter((award) =>
      (!filters.scholarship || award.type === filters.scholarship) &&
      (!programFilters || !award.levels.length || programs.some((program) => award.levels.includes(program.level))),
    );
    if (filters.scholarship && !awards.length) return [];
    if (programs.length || (!programFilters && terms.every((term) => universityText.includes(term)))) return [{ record, programs, awards }];
    return [];
  });
}
