import type { Metadata } from "next";
import { Suspense } from "react";
import { Lock } from "lucide-react";
import Link from "next/link";
import { getTier } from "@/lib/tier.server";
import { getCities, hasPlaceholderRecords, searchUniversities } from "@/lib/universities/queries";
import type { ProgramLevel, TeachingLanguage, UniversityCategory } from "@/lib/universities/types";
import { UniversityCard } from "@/components/universities/UniversityCard";
import { DirectoryFilters } from "@/components/universities/DirectoryFilters";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Chinese University Directory",
  description:
    "Browse Chinese universities by city, study level, teaching language and category. Compare tuition and hostel costs for Bangladeshi students planning to study in China.",
};

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const UniversitiesPage = ({ searchParams }: PageProps) => {
  const tier = getTier();
  const results = searchUniversities(
    {
      query: one(searchParams.q),
      city: one(searchParams.city),
      level: one(searchParams.level) as ProgramLevel | undefined,
      language: one(searchParams.language) as TeachingLanguage | undefined,
      category: one(searchParams.category) as UniversityCategory | undefined,
    },
    tier,
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 max-w-2xl">
            <h1 className="font-display text-3xl font-bold tracking-tight text-secondary lg:text-5xl">
              University Directory
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Compare tuition and hostel costs across Chinese universities. Free access shows
              costs, location and available programmes. University names, scholarship details and
              our application guidance are part of Premium.
            </p>
          </header>

          {hasPlaceholderRecords() && (
            <div className="mb-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm leading-relaxed text-destructive">
              <strong className="font-bold">Sample data.</strong> This directory is running on
              placeholder records so the layout and access rules can be reviewed. No figure shown
              here describes a real university yet.
            </div>
          )}

          <Suspense fallback={<div className="h-48 rounded-3xl bg-accent" />}>
            <DirectoryFilters cities={getCities()} />
          </Suspense>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "university" : "universities"}
            </p>
            {tier === "free" && (
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Lock className="h-3 w-3" /> Free view
              </p>
            )}
          </div>

          {results.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-border bg-card p-12 text-center">
              <h2 className="font-display text-xl font-bold text-secondary">No matches</h2>
              <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
                No university matches these filters. Try widening your search, or ask our advisor
                what fits your results.
              </p>
              <Link
                href="/ai-advisor"
                className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
              >
                Ask the advisor
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {results.map((u) => (
                <UniversityCard key={u.id} university={u} />
              ))}
            </div>
          )}

          {tier === "free" && results.length > 0 && (
            <section className="mt-12 rounded-3xl bg-secondary p-8 text-center lg:p-12">
              <h2 className="font-display text-2xl font-bold text-secondary-foreground lg:text-3xl">
                See which university is which
              </h2>
              <p className="mx-auto mt-3 max-w-xl leading-relaxed text-secondary-foreground/80">
                Premium reveals university names, the scholarships each one offers, our written
                guidance on applying, and one-to-one support from a counsellor.
              </p>
              <Link
                href="/pricing"
                className="mt-6 inline-block rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
              >
                Compare plans
              </Link>
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default UniversitiesPage;
