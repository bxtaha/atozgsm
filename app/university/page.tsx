import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, MapPin, Search } from "lucide-react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { listCatalog } from "@/lib/universities/catalog";
import { searchCatalog, type CatalogFilters } from "@/lib/universities/catalog-search";
import { levels } from "@/lib/universities/catalog-schema";
import { formatCny } from "@/lib/universities/format";

export const metadata: Metadata = { title: "University and Scholarship Directory", description: "Find Chinese universities, international programmes, tuition fees and scholarship requirements by city, intake and subject." };
export const dynamic = "force-dynamic";
const control = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm";

export default function UniversityDirectory({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const keys = ["q", "city", "level", "intake", "subject", "maxTuition", "scholarship"] as const;
  const filters: CatalogFilters = {};
  for (const key of keys) {
    const value = searchParams[key];
    if (typeof value === "string") filters[key] = value.trim().slice(0, 240);
  }
  const records = listCatalog().map(({ record }) => record);
  const results = searchCatalog(records, filters);
  const cities = [...new Set(records.map((record) => record.city))].sort();
  const subjects = [...new Set(records.flatMap((record) => record.programs.flatMap((program) => program.subjects)))].sort();
  const scholarshipTypes = [...new Set(records.flatMap((record) => record.scholarships.map((award) => award.type)))].sort();
  const selects = [
    { key: "city", label: "City", options: cities.map((city) => [city, city]) },
    { key: "level", label: "Study level", options: Object.entries(levels) },
    { key: "intake", label: "Intake", options: [["3", "March"], ["9", "September"]] },
    { key: "subject", label: "Subject", options: subjects.map((subject) => [subject, subject]) },
    { key: "scholarship", label: "Scholarship type", options: scholarshipTypes.map((type) => [type, type]) },
  ] as const;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 lg:py-16">
        <header className="mb-8 max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-secondary lg:text-6xl">Find a university in China</h1>
          <p className="mt-4 text-lg text-muted-foreground">Compare international programmes, published tuition, and scholarship requirements.</p>
        </header>
        <form action="/university" method="get" className="rounded-3xl border border-border bg-card p-5 sm:p-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">University, subject, or scholarship</span>
            <input name="q" type="search" defaultValue={filters.q} placeholder="e.g. Computer Science or CSC" className={control} />
          </label>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selects.map(({ key, label, options }) => (
              <label key={key} className="min-w-0">
                <span className="mb-1.5 block text-sm font-semibold">{label}</span>
                <select name={key} defaultValue={filters[key] ?? ""} className={control}>
                  <option value="">All</option>
                  {options.map(([value, title]) => <option key={value} value={value}>{title}</option>)}
                </select>
              </label>
            ))}
            <label>
              <span className="mb-1.5 block text-sm font-semibold">Max tuition (CNY/year)</span>
              <input type="number" min="0" max="10000000" name="maxTuition" defaultValue={filters.maxTuition} className={control} />
            </label>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"><Search className="h-4 w-4" /> Search</button>
            {Object.values(filters).some(Boolean) && <Link href="/university" className="text-sm font-semibold text-muted-foreground">Clear filters</Link>}
          </div>
        </form>
        <p className="my-6 text-sm text-muted-foreground">{results.length} {results.length === 1 ? "university" : "universities"}</p>
        {results.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(({ record, programs }) => {
              const fees = programs.flatMap((p) => p.tuitionPeriod === "year" && p.tuitionCny !== null ? [p.tuitionCny] : []);
              return (
                <Link key={record.slug} href={`/university/${record.slug}`} className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" />{record.city}, {record.province}</p>
                  <h2 className="my-3 font-display text-xl font-bold leading-snug text-secondary">{record.name}</h2>
                  <p className="mb-2 text-sm">{fees.length ? `Annual tuition from ${formatCny(Math.min(...fees))}` : "See programme and tuition details"}</p>
                  <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><GraduationCap className="h-4 w-4 shrink-0" />{record.scholarships.length ? `${record.scholarships.length} scholarship options` : "Scholarship details pending"}</p>
                  <span className="mt-auto flex items-center gap-1.5 text-sm font-bold text-primary-text">View university <ArrowUpRight className="h-4 w-4" /></span>
                </Link>
              );
            })}
          </div>
        ) : <p className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">No universities match these filters.</p>}
      </main>
      <SiteFooter />
    </div>
  );
}
