import type { Metadata } from "next";
import Link from "next/link";
import { Ban, Calendar, Clock, FileQuestion, Play } from "lucide-react";
import { EXAM_RULES, subjects } from "@/lib/csca/syllabus";
import { filterQuestions, hasVerifiedPastPapers } from "@/lib/csca/questions";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "CSCA Exam Preparation",
  description:
    "Prepare for the CSCA (Chinese Scholastic Competency Assessment): syllabus breakdown by module weight for Mathematics, Physics and Chemistry, plus timed practice with worked solutions.",
  alternates: { canonical: "/csca" },
};

const RULES = [
  { icon: Clock, label: "Duration", value: "60 min science papers · 90 min Chinese papers" },
  { icon: FileQuestion, label: "Format", value: `Single-choice MCQs · ${EXAM_RULES.totalMarks} marks each` },
  { icon: Ban, label: "Calculators", value: "Not allowed — mental maths only" },
  { icon: Calendar, label: "Sittings", value: `${EXAM_RULES.sittingsPerYear} per year (${EXAM_RULES.sittingMonths})` },
];

const CscaPage = () => (
  <div className="flex min-h-dvh flex-col">
    <SiteHeader />

    <main className="flex-1 px-4 py-12 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary-text">Exam preparation</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-secondary dark:text-foreground lg:text-5xl">
            CSCA preparation
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            The Chinese Scholastic Competency Assessment is the common entrance exam for
            bachelor&apos;s applicants. Your score affects both admission and the scholarship band
            you qualify for — so what you practise, and in what proportion, matters.
          </p>
        </header>

        <section className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {RULES.map((r) => (
            <div key={r.label} className="rounded-2xl border border-border bg-card p-5">
              <r.icon className="mb-3 h-4 w-4 text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{r.label}</p>
              <p className="mt-1.5 text-sm font-bold leading-snug text-foreground">{r.value}</p>
            </div>
          ))}
        </section>

        <p className="mb-10 rounded-2xl bg-accent px-5 py-4 text-sm leading-relaxed text-foreground">
          <strong className="font-bold">No negative marking.</strong> An unanswered question scores
          zero and a wrong one costs nothing, so never leave a blank — with four options, a guess is
          worth more than silence.
        </p>

        <section className="mb-12">
          <h2 className="mb-2 font-display text-2xl font-bold text-secondary dark:text-foreground">
            What&apos;s on each paper
          </h2>
          <p className="mb-6 text-muted-foreground">
            Module weights describe the typical shape of a paper. Use them to decide where your
            revision time goes — but treat them as a guide, not a promise about your sitting.
          </p>

          <div className="space-y-6">
            {subjects.map((subject) => (
              <article key={subject.id} className="rounded-3xl border border-border bg-card p-6 lg:p-8">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-secondary dark:text-foreground">
                    {subject.name}
                    {subject.nameZh && (
                      <span className="ml-2 text-base font-normal text-muted-foreground">{subject.nameZh}</span>
                    )}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{subject.requiredFor}</p>
                </div>

                <p className="mb-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{subject.format.durationMinutes} minutes</span>
                  <span>{subject.format.totalMarks} marks</span>
                  {subject.format.questionCount && <span>{subject.format.questionCount} questions</span>}
                  <span>{subject.format.languages}</span>
                </p>

                <ul className="space-y-4">
                  {subject.modules.map((m) => (
                    <li key={m.id}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-3">
                        <span className="text-sm font-bold text-foreground">{m.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {m.weight}% · {m.averageQuestions} Q
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${m.weight}%` }} />
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {m.topics.map((t) => t.name).join(" · ")}
                      </p>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/csca/practice?subject=${subject.id}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
                >
                  <Play className="h-3.5 w-3.5" />
                  Practise {subject.name} ({filterQuestions({ subject: subject.id }).length})
                </Link>
              </article>
            ))}
          </div>
        </section>

        {!hasVerifiedPastPapers() && (
          <p className="rounded-2xl border border-warning/40 bg-warning/10 px-5 py-4 text-sm leading-relaxed text-foreground">
            <strong className="font-bold">About this question bank.</strong> Every question here is
            ATOZ GSM practice material written against the syllabus and checked for accuracy — none
            of it is transcribed from a real past paper, and nothing claims to be. Past-paper
            questions will be labelled with their year and sitting when they are added.
          </p>
        )}
      </div>
    </main>

    <SiteFooter />
  </div>
);

export default CscaPage;
