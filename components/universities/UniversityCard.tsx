import Link from "next/link";
import { Lock, MapPin, BedDouble, GraduationCap, Award } from "lucide-react";
import { isLocked, type VisibleUniversity } from "@/lib/universities/types";
import { CATEGORY_LABELS, formatCny, LEVEL_LABELS } from "@/lib/universities/format";

const levelSummary = (u: VisibleUniversity) => {
  const levels = Array.from(new Set(u.programs.map((p) => p.level)));
  return levels.map((l) => LEVEL_LABELS[l]).join(" · ");
};

export const UniversityCard = ({ university: u }: { university: VisibleUniversity }) => (
  <article className="relative flex flex-col rounded-3xl border border-border bg-card p-6 shadow-[0_8px_24px_rgba(11,31,58,0.06)] transition-shadow hover:shadow-[0_12px_32px_rgba(11,31,58,0.12)]">
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        {isLocked(u) ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-secondary/10 px-3 text-[11px] font-bold uppercase tracking-wider text-secondary">
              <Lock className="h-3 w-3" /> Name locked
            </span>
          </div>
        ) : (
          <h3 className="font-display text-xl font-bold leading-tight text-secondary">{u.name}</h3>
        )}
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {u.city}, {u.province}
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary-text">
        {CATEGORY_LABELS[u.category]}
      </span>
    </div>

    <dl className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
      <div>
        <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <GraduationCap className="h-3 w-3" /> Tuition / year
        </dt>
        <dd className="mt-1 font-bold text-foreground">
          {formatCny(u.tuitionCnyPerYear.min)} – {formatCny(u.tuitionCnyPerYear.max)}
        </dd>
      </div>
      <div>
        <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <BedDouble className="h-3 w-3" /> Hostel / year
        </dt>
        <dd className="mt-1 font-bold text-foreground">
          {formatCny(u.hostelCnyPerYear.min)} – {formatCny(u.hostelCnyPerYear.max)}
        </dd>
      </div>
    </dl>

    <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{levelSummary(u)}</p>

    <div className="mt-5 border-t border-border pt-4">
      {isLocked(u) ? (
        <div className="space-y-3">
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Award className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              {u.scholarshipCount > 0
                ? `${u.scholarshipCount} scholarship ${u.scholarshipCount === 1 ? "option" : "options"} recorded for this university.`
                : "No scholarship options recorded for this university yet."}
            </span>
          </p>
          <Link
            href="/pricing"
            className="block rounded-full bg-secondary px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-secondary-foreground transition-all hover:brightness-125"
          >
            Unlock name &amp; scholarships
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Award className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              {u.scholarships.length > 0
                ? u.scholarships.map((s) => s.name).join(", ")
                : "No scholarship options recorded yet."}
            </span>
          </p>
          <Link
            href={`/universities/${u.slug}`}
            className="block rounded-full bg-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
          >
            View full profile
          </Link>
        </div>
      )}
    </div>

    {u.isPlaceholder && (
      <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-[11px] leading-relaxed text-destructive">
        Sample record — fees and scholarships are not verified information.
      </p>
    )}
  </article>
);
