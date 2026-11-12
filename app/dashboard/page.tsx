import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { calculateReadiness, getDocuments, getProfile } from "@/lib/profile";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { LEVEL_LABELS, LANGUAGE_LABELS } from "@/lib/universities/format";

export const metadata: Metadata = {
  title: "Your dashboard",
  robots: { index: false },
};

const DashboardPage = () => {
  const user = getCurrentUser();
  if (!user) redirect("/login");

  const profile = getProfile(user.id);
  if (!profile.onboardedAt) redirect("/onboarding");

  const documents = getDocuments(user.id);
  const readiness = calculateReadiness(profile, documents);

  return (
    <DashboardShell user={user}>
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-secondary lg:text-4xl">
          Welcome back, {user.firstName}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {readiness.percent === 100
            ? "Every required document is in. A counsellor can review them with you now."
            : `Your application is ${readiness.percent}% ready.`}
        </p>
      </header>

      <section className="mb-8 rounded-3xl border border-border bg-card p-6 lg:p-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Application readiness
            </h2>
            <p className="mt-2 font-display text-5xl font-bold text-secondary">{readiness.percent}%</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {readiness.completed} of {readiness.total} required documents
          </p>
        </div>

        <div
          className="h-3 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={readiness.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Application readiness"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-700"
            style={{ width: `${readiness.percent}%` }}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 lg:p-8">
          <h2 className="mb-1 font-display text-xl font-bold text-secondary">Your next actions</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            {readiness.missing.length === 0
              ? "Nothing outstanding."
              : `${readiness.missing.length} required ${readiness.missing.length === 1 ? "document" : "documents"} still needed.`}
          </p>

          {readiness.missing.length === 0 ? (
            <p className="rounded-2xl bg-green-100 px-5 py-4 text-sm text-green-800">
              All required documents uploaded. Book a session and we&apos;ll go through them with you.
            </p>
          ) : (
            <ul className="space-y-2">
              {readiness.missing.slice(0, 6).map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/dashboard/documents#${item.id}`}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-accent px-5 py-4 transition-colors hover:bg-muted"
                  >
                    <span className="font-bold text-foreground">Upload {item.label}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Your plan
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Study level</dt>
                <dd className="font-bold text-foreground">
                  {profile.studyLevel ? LEVEL_LABELS[profile.studyLevel] : "Not set"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Taught in</dt>
                <dd className="font-bold text-foreground">
                  {profile.studyLanguage ? LANGUAGE_LABELS[profile.studyLanguage] : "Not set"}
                </dd>
              </div>
              {profile.subject && (
                <div>
                  <dt className="text-muted-foreground">Subject</dt>
                  <dd className="font-bold text-foreground">{profile.subject}</dd>
                </div>
              )}
            </dl>
            <Link
              href="/onboarding"
              className="mt-5 block text-xs font-bold uppercase tracking-wider text-primary-text hover:underline"
            >
              Change these
            </Link>
          </section>

          {user.tier === "free" && (
            <section className="rounded-3xl bg-secondary p-6">
              <Sparkles className="mb-3 h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-bold text-secondary-foreground">
                Want your documents checked?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-secondary-foreground/80">
                Premium includes one-to-one counselling and a document review before you submit.
              </p>
              <Link
                href="/pricing"
                className="mt-4 block rounded-full bg-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
              >
                See Premium
              </Link>
            </section>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default DashboardPage;
