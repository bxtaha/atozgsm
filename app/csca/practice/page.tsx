import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buildSession } from "@/lib/csca/questions";
import type { Difficulty, SubjectId } from "@/lib/csca/syllabus";
import { getSubject } from "@/lib/csca/syllabus";
import { PracticeSession } from "@/components/csca/PracticeSession";
import { PracticeSetup } from "@/components/csca/PracticeSetup";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "CSCA Practice",
  robots: { index: false },
};

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const PracticePage = ({ searchParams }: PageProps) => {
  const subject = one(searchParams.subject) as SubjectId | undefined;
  const topicId = one(searchParams.topic);
  const difficulty = one(searchParams.difficulty) as Difficulty | undefined;
  const count = Number(one(searchParams.count) ?? 5);
  const started = one(searchParams.start) === "1";

  const questions = started ? buildSession({ subject, topicId, difficulty }, count) : [];

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-8 lg:py-12">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/csca"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary-text"
          >
            <ArrowLeft className="h-4 w-4" /> CSCA preparation
          </Link>

          {!started ? (
            <>
              <h1 className="mb-2 font-display text-3xl font-bold tracking-tight text-secondary dark:text-foreground">
                Set up your practice
              </h1>
              <p className="mb-8 leading-relaxed text-muted-foreground">
                Work without a calculator — the real paper does not allow one, and practising with
                one builds the wrong habit.
              </p>
              <PracticeSetup initialSubject={subject} />
            </>
          ) : questions.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">
              <h1 className="font-display text-xl font-bold text-secondary dark:text-foreground">
                No questions match yet
              </h1>
              <p className="mx-auto mt-3 max-w-sm leading-relaxed text-muted-foreground">
                The bank doesn&apos;t have questions for{" "}
                {subject ? getSubject(subject)?.name : "that selection"} with these filters yet. Try
                a broader selection.
              </p>
              <Link
                href="/csca/practice"
                className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
              >
                Change filters
              </Link>
            </div>
          ) : (
            <PracticeSession questions={questions} />
          )}
        </div>
      </main>
    </div>
  );
};

export default PracticePage;
