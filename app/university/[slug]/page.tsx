import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { listCatalog } from "@/lib/universities/catalog";
import { levels } from "@/lib/universities/catalog-schema";
import { formatCny } from "@/lib/universities/format";

export const dynamic = "force-dynamic";

function getRecord(slug: string) {
  return listCatalog().find(({ record }) => record.slug === slug)?.record;
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const record = getRecord(params.slug);
  return record ? { title: `${record.name} | Admissions & Scholarships`, description: `International programmes, tuition and scholarship requirements at ${record.name}.` } : {};
}

function Fields({ items }: { items: [string, string | null][] }) {
  return (
    <dl className="my-4 grid gap-3 text-sm">
      {items.map(([label, value]) => value && (
        <div key={label} className="grid gap-1 sm:grid-cols-[9rem_1fr]">
          <dt className="font-semibold">{label}</dt>
          <dd className="text-muted-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Source({ source }: { source: import("@/lib/universities/catalog-schema").CatalogProgram["source"] }) {
  return <a href={source.url} className="inline-flex items-center gap-1 text-sm font-semibold text-primary-text underline underline-offset-4">{source.title} <ExternalLink className="h-3.5 w-3.5 shrink-0" /></a>;
}

export default function UniversityDetails({ params }: { params: { slug: string } }) {
  const record = getRecord(params.slug);
  if (!record) notFound();
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <Link href="/university" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> University directory</Link>
        <h1 className="font-display text-4xl font-bold text-secondary">{record.name}</h1>
        <p className="mt-3 flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{record.city}, {record.province}</p>
        {record.note && <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{record.note}</p>}
        <div className="mt-4 flex flex-wrap gap-5">
          <Source source={{ title: "University website", url: record.website }} />
          {record.applicationUrl && <Source source={{ title: "University application portal", url: record.applicationUrl }} />}
        </div>
        <section className="mt-9">
          <h2 className="mb-4 font-display text-2xl font-bold text-secondary">Scholarships</h2>
          <div className="space-y-3">
            {record.scholarships.map((s) => (
              <article key={s.id} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-lg font-bold">{s.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{[s.type, s.cycleYear, ...s.levels.map((level) => levels[level])].filter(Boolean).join(" · ")}</p>
                <Fields items={[["Coverage", s.coverage], ["Eligibility", s.eligibility], ["Deadline", s.deadline], ["Application", s.application], ["Renewal", s.renewal]]} />
                <Source source={s.source} />
              </article>
            ))}
            {!record.scholarships.length && <p className="text-muted-foreground">Scholarship details have yet to be confirmed.</p>}
          </div>
        </section>
        <section className="mt-9">
          <h2 className="mb-4 font-display text-2xl font-bold text-secondary">Programmes and tuition</h2>
          <div className="space-y-3">
            {record.programs.map((p) => (
              <article key={p.id} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{[levels[p.level], p.language, p.duration].filter(Boolean).join(" · ")}</p>
                <Fields items={[
                  ["Intake", [p.intakeMonth === 3 ? "March" : p.intakeMonth === 9 ? "September" : null, p.intakeYear].filter(Boolean).join(" ") || null],
                  ["Tuition", p.tuitionCny === null ? null : `${formatCny(p.tuitionCny)} / ${p.tuitionPeriod}`],
                  ["Deadline", p.applicationDeadline],
                  ["Subjects", p.subjects.join(", ")],
                  ["Requirements", p.requirements],
                  ["Other fees", p.fees],
                ]} />
                <Source source={p.source} />
              </article>
            ))}
            {!record.programs.length && <p className="text-muted-foreground">Programme details have yet to be confirmed.</p>}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
