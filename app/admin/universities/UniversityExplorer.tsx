"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { levels, type CatalogRecord } from "@/lib/universities/catalog-schema";
import { searchCatalog, type CatalogFilters } from "@/lib/universities/catalog-search";
import { formatCny } from "@/lib/universities/format";
import { Editor } from "./Editor";

const control = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm";

export function UniversityExplorer({ entries }: { entries: { record: CatalogRecord; published: boolean }[] }) {
  const [filters, setFilters] = useState<CatalogFilters>({});
  const [editing, setEditing] = useState<string | null>(null);
  const bySlug = new Map(entries.map((entry) => [entry.record.slug, entry]));
  const records = entries.map(({ record }) => record);
  const results = searchCatalog(records, filters);
  const cities = [...new Set(records.map(({ city }) => city))].sort();
  const subjects = [...new Set(records.flatMap(({ programs }) => programs.flatMap((program) => program.subjects)))].sort();
  const scholarshipTypes = [...new Set(records.flatMap(({ scholarships }) => scholarships.map((award) => award.type)))].sort();
  const selects = [
    { key: "intake", label: "Intake", options: [["3", "March"], ["9", "September"]] },
    { key: "level", label: "Programme level", options: Object.entries(levels) },
    { key: "scholarship", label: "Scholarship type", options: scholarshipTypes.map((type) => [type, type]) },
    { key: "city", label: "City", options: cities.map((city) => [city, city]) },
    { key: "subject", label: "Subject", options: subjects.map((subject) => [subject, subject]) },
  ] as const;
  const setFilter = (key: keyof CatalogFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <>
      <section aria-label="Search and filter universities" className="rounded-2xl border border-border bg-card p-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Search universities</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input type="search" value={filters.q ?? ""} onChange={(event) => setFilter("q", event.target.value)} placeholder="University name, subject, or scholarship" className={`${control} pl-9`} />
          </span>
        </label>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selects.map(({ key, label, options }) => (
            <label className="grid min-w-0 gap-1 text-sm font-semibold" key={key}>
              {label}
              <select value={filters[key] ?? ""} onChange={(event) => setFilter(key, event.target.value)} className={`${control} font-normal`}>
                <option value="">All</option>
                {options.map(([value, title]) => <option value={value} key={value}>{title}</option>)}
              </select>
            </label>
          ))}
          <label className="grid gap-1 text-sm font-semibold">
            Max tuition (CNY/year)
            <input type="number" min={0} max={10000000} value={filters.maxTuition ?? ""} onChange={(event) => setFilter("maxTuition", event.target.value)} className={`${control} font-normal`} />
          </label>
        </div>
        {Object.values(filters).some(Boolean) && (
          <button type="button" onClick={() => setFilters({})} className="mt-4 text-sm font-semibold text-primary-text">Clear filters</button>
        )}
      </section>

      <p aria-live="polite" className="my-5 text-sm text-muted-foreground">{results.length} of {entries.length} universities</p>
      <div className="grid gap-3">
        {results.map(({ record, programs }) => {
          const entry = bySlug.get(record.slug);
          const awards = record.scholarships.filter((award) => !filters.scholarship || award.type === filters.scholarship);
          return (
            <article key={record.slug} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-secondary">{record.name}</h2>
                  <p className="text-sm text-muted-foreground">{record.city}, {record.province} · {entry?.published ? "Published" : "Draft"}</p>
                </div>
                <button type="button" aria-expanded={editing === record.slug} onClick={() => setEditing(editing === record.slug ? null : record.slug)} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                  {editing === record.slug ? "Close editor" : "Edit university"}
                </button>
              </div>
              <p className="mt-3 text-sm">{programs.length} programme records · {awards.length} scholarship records</p>
              {(programs.length > 0 || awards.length > 0) && (
                <details className="mt-3 text-sm">
                  <summary className="cursor-pointer font-semibold text-primary-text">Programmes and scholarships</summary>
                  <ul className="mt-3 space-y-3">
                    {programs.map((program) => (
                      <li key={`program-${program.id}`}>
                        <p className="font-semibold">{program.name}</p>
                        <p className="text-muted-foreground">{[
                          levels[program.level],
                          program.intakeMonth === 3 ? "March" : program.intakeMonth === 9 ? "September" : null,
                          program.intakeYear,
                          program.tuitionCny === null ? null : `${formatCny(program.tuitionCny)} / ${program.tuitionPeriod}`,
                        ].filter(Boolean).join(" · ")}</p>
                        {program.requirements && <p>{program.requirements}</p>}
                      </li>
                    ))}
                    {awards.map((award) => (
                      <li key={`scholarship-${award.id}`}>
                        <p className="font-semibold">{award.name}</p>
                        <p className="text-muted-foreground">{[award.type, award.cycleYear, award.deadline].filter(Boolean).join(" · ")}</p>
                        {award.coverage && <p>{award.coverage}</p>}
                        {award.eligibility && <p>{award.eligibility}</p>}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              {editing === record.slug && entry && <div className="mt-4 border-t border-border pt-4"><Editor entry={entry} /></div>}
            </article>
          );
        })}
      </div>
      {results.length === 0 && (
        <p className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
          {entries.length ? "No universities match these filters." : "Import a catalog JSON file to start searching universities."}
        </p>
      )}
    </>
  );
}
