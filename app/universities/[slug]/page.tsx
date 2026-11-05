import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, BedDouble, ExternalLink, Lock, MapPin } from "lucide-react";
import { getTier } from "@/lib/tier.server";
import { getUniversityBySlug } from "@/lib/universities/queries";
import { CATEGORY_LABELS, formatCny, LANGUAGE_LABELS, LEVEL_LABELS } from "@/lib/universities/format";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "University Profile",
  robots: { index: false },
};

const UniversityProfilePage = ({ params }: { params: { slug: string } }) => {
  const tier = getTier();
  const university = getUniversityBySlug(params.slug, tier);

  if (tier !== "premium") {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center px-4 py-20">
          <div className="max-w-md rounded-3xl border border-border bg-card p-10 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
              <Lock className="h-6 w-6 text-secondary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-secondary">This profile is Premium</h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              University names, scholarship details and our application guidance are part of the
              Premium plan. Costs, location and programme lists stay free for everyone.
            </p>
            <Link
              href="/pricing"
              className="mt-6 inline-block rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
            >
              See what Premium includes
            </Link>
            <Link
              href="/universities"
              className="mt-4 block text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary-text"
            >
              Back to directory
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!university) notFound();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/universities"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary-text"
          >
            <ArrowLeft className="h-4 w-4" /> Back to directory
          </Link>

          {university.isPlaceholder && (
            <div className="mb-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              <strong className="font-bold">Sample record.</strong> Nothing on this page is
              verified information about a real university.
            </div>
          )}

          <header className="mb-10">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary-text">
              {CATEGORY_LABELS[university.category]}
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-secondary lg:text-5xl">
              {university.name}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {university.city}, {university.province}
            </p>
          </header>

          <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tuition / year</p>
              <p className="mt-2 font-display text-2xl font-bold text-secondary">
                {formatCny(university.tuitionCnyPerYear.min)} – {formatCny(university.tuitionCnyPerYear.max)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <BedDouble className="h-3 w-3" /> Hostel / year
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-secondary">
                {formatCny(university.hostelCnyPerYear.min)} – {formatCny(university.hostelCnyPerYear.max)}
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 font-display text-2xl font-bold text-secondary">Programmes</h2>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-accent text-[10px] uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-bold">Subject</th>
                    <th scope="col" className="px-5 py-3 font-bold">Level</th>
                    <th scope="col" className="px-5 py-3 font-bold">Language</th>
                    <th scope="col" className="px-5 py-3 font-bold">Duration</th>
                    <th scope="col" className="px-5 py-3 font-bold">Tuition / year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {university.programs.map((p) => (
                    <tr key={`${p.level}-${p.field}`}>
                      <td className="px-5 py-4 font-bold text-foreground">{p.field}</td>
                      <td className="px-5 py-4 text-muted-foreground">{LEVEL_LABELS[p.level]}</td>
                      <td className="px-5 py-4 text-muted-foreground">{LANGUAGE_LABELS[p.language]}</td>
                      <td className="px-5 py-4 text-muted-foreground">{p.durationYears} years</td>
                      <td className="px-5 py-4 text-muted-foreground">{formatCny(p.tuitionCnyPerYear)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold text-secondary">
              <Award className="h-5 w-5 text-primary" /> Scholarships
            </h2>
            {university.scholarships.length === 0 ? (
              <p className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
                No scholarship options recorded for this university yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {university.scholarships.map((s) => (
                  <li key={s.name} className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-display text-lg font-bold text-secondary">{s.name}</h3>
                    <dl className="mt-3 space-y-2 text-sm">
                      <div>
                        <dt className="inline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Coverage: </dt>
                        <dd className="inline text-foreground">{s.coverage}</dd>
                      </div>
                      <div>
                        <dt className="inline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Eligibility: </dt>
                        <dd className="inline text-foreground">{s.eligibility}</dd>
                      </div>
                      <div>
                        <dt className="inline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Source: </dt>
                        <dd className="inline text-muted-foreground">{s.source} (last checked {s.lastVerified})</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mb-10 rounded-3xl bg-secondary p-8">
            <h2 className="mb-3 font-display text-2xl font-bold text-secondary-foreground">
              ATOZ GSM guidance
            </h2>
            <p className="leading-relaxed text-secondary-foreground/80">{university.guidance}</p>
          </section>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/#apply"
              className="flex-1 rounded-full bg-primary px-8 py-4 text-center text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
            >
              Start my application
            </Link>
            <a
              href={university.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary-text"
            >
              Official website <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default UniversityProfilePage;
