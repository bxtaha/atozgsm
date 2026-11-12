"use client";

import { useState } from "react";
import { FileDown, Search } from "lucide-react";
import { levels, type CatalogRecord } from "@/lib/universities/catalog-schema";
import { searchCatalog, type CatalogFilters } from "@/lib/universities/catalog-search";
import { Editor } from "./Editor";
import { SubjectFilter } from "./SubjectFilter";
import { UniversityDetails } from "./UniversityDetails";

const control = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm";

export function UniversityExplorer({ records }: { records: CatalogRecord[] }) {
  const [filters, setFilters] = useState<CatalogFilters>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const results = searchCatalog(records, filters);
  const shortlist = results.filter(({ record }) => selected.includes(record.slug));
  const cities = [...new Set(records.map(({ city }) => city))].sort();
  const subjects = [...new Set(records.flatMap(({ programs }) => programs.flatMap((program) => program.subjects)))].sort();
  const scholarshipTypes = [...new Set(records.flatMap(({ scholarships }) => scholarships.map((award) => award.type)))].sort();
  const selects = [
    { key: "intake", label: "Intake", options: [["3", "March"], ["9", "September"]] },
    { key: "level", label: "Programme level", options: Object.entries(levels) },
    { key: "scholarship", label: "Scholarship type", options: scholarshipTypes.map((type) => [type, type]) },
    { key: "city", label: "City", options: cities.map((city) => [city, city]) },
  ] as const;
  const setFilter = (key: keyof CatalogFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <>
      <div className="print:hidden">
        <section aria-label="Search and filter universities" className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Search universities</span>
            <span className="relative block">
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <input type="search" value={filters.q ?? ""} onChange={(event) => setFilter("q", event.target.value)} placeholder="University name, subject, or scholarship" className="h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" />
            </span>
          </label>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SubjectFilter subjects={subjects} value={filters.subject ?? ""} onChange={(subject) => setFilter("subject", subject)} />
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

        <div className="my-5 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm text-muted-foreground">{results.length} of {records.length} universities</p>
          <div className="flex flex-wrap items-center gap-3">
            {selected.length > 0 && (
              <button type="button" onClick={() => setSelected([])} className="text-sm text-muted-foreground">Clear shortlist</button>
            )}
            <button type="button" disabled={!shortlist.length} onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
              <FileDown aria-hidden="true" className="h-4 w-4" />
              Save shortlist as PDF ({shortlist.length})
            </button>
          </div>
        </div>
        <div className="grid gap-3">
          {results.map(({ record, programs, awards }) => (
            <article key={record.slug} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-secondary">{record.name}</h2>
                  <p className="text-sm text-muted-foreground">{record.city}, {record.province}</p>
                </div>
                <label className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={selected.includes(record.slug)}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setSelected((current) => checked ? [...current, record.slug] : current.filter((slug) => slug !== record.slug));
                    }}
                    aria-label={`Add ${record.name} to shortlist`}
                    className="h-4 w-4 accent-primary"
                  />
                  Shortlist
                </label>
              </div>
              <p className="mt-3 text-sm">{programs.length} programme records · {awards.length} scholarship records</p>
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer font-semibold text-primary-text">University details</summary>
                <div className="mt-3 space-y-3">
                  {record.note && <p className="text-muted-foreground">{record.note}</p>}
                  <div className="flex flex-wrap gap-3">
                    <a href={record.website} className="underline">University website</a>
                    {record.applicationUrl && <a href={record.applicationUrl} className="underline">Application portal</a>}
                  </div>
                  <UniversityDetails programs={programs} awards={awards} showSources />
                </div>
              </details>
              <button type="button" aria-expanded={editing === record.slug} onClick={() => setEditing(editing === record.slug ? null : record.slug)} className="mt-3 text-sm font-semibold text-primary-text">
                {editing === record.slug ? "Close editor" : "Edit university"}
              </button>
              {editing === record.slug && <div className="mt-4 border-t border-border pt-4"><Editor entry={record} /></div>}
            </article>
          ))}
        </div>
        {!results.length && (
          <p className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            {records.length ? "No universities match these filters." : "Import a catalog JSON file to start searching universities."}
          </p>
        )}
      </div>
      {shortlist.length > 0 && (
        <div className="hidden bg-white p-3 text-black print:block">
          <header className="mb-6 border-b border-black pb-4">
            <p className="text-sm font-bold">ATOZ GSM</p>
            <h1 className="mt-1 text-3xl font-bold">University and scholarship shortlist</h1>
            <p className="mt-2 text-sm">Confirm intake dates, fees and scholarship terms for your application cycle.</p>
          </header>
          {shortlist.map(({ record, programs, awards }) => (
            <section key={record.slug} className="mb-6 border-b border-gray-400 pb-5">
              <h2 className="text-xl font-bold print:break-after-avoid">{record.name}</h2>
              <p className="mb-3 text-sm print:break-after-avoid">{record.city}, {record.province}</p>
              <UniversityDetails programs={programs} awards={awards} />
            </section>
          ))}
        </div>
      )}
    </>
  );
}
