"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, CircleAlert, Lightbulb, RotateCcw, X } from "lucide-react";
import type { Question } from "@/lib/csca/questions";
import { SOURCE_LABELS } from "@/lib/csca/questions";
import { getTopicName } from "@/lib/csca/syllabus";
import { recordAttempt } from "@/app/csca/actions";
import { trackEvent } from "@/lib/analytics/meta-pixel";

interface Answered {
  question: Question;
  chosenIndex: number;
  correct: boolean;
  seconds: number;
}

const formatClock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export const PracticeSession = ({ questions }: { questions: Question[] }) => {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answered[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const questionStart = useRef(Date.now());

  const question = questions[index];
  const finished = index >= questions.length;

  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [finished]);

  const choose = useCallback(
    (optionIndex: number) => {
      if (chosen !== null) return;
      const seconds = Math.round((Date.now() - questionStart.current) / 1000);
      const correct = optionIndex === question.correctIndex;

      setChosen(optionIndex);
      setAnswers((a) => [...a, { question, chosenIndex: optionIndex, correct, seconds }]);
      void recordAttempt({ questionId: question.id, correct, secondsTaken: seconds });
    },
    [chosen, question],
  );

  const next = () => {
    setChosen(null);
    questionStart.current = Date.now();
    setIndex((i) => i + 1);
  };

  useEffect(() => {
    if (finished && answers.length > 0) {
      trackEvent("CscaPracticeCompleted", { questions: answers.length });
    }
  }, [finished, answers.length]);

  if (finished) {
    const correctCount = answers.filter((a) => a.correct).length;
    const percent = answers.length === 0 ? 0 : Math.round((correctCount / answers.length) * 100);

    const byTopic = new Map<string, { correct: number; total: number; subject: string }>();
    for (const a of answers) {
      const key = `${a.question.subject}:${a.question.topicId}`;
      const entry = byTopic.get(key) ?? { correct: 0, total: 0, subject: a.question.subject };
      entry.total += 1;
      if (a.correct) entry.correct += 1;
      byTopic.set(key, entry);
    }
    const weakest = [...byTopic.entries()]
      .map(([key, v]) => ({ key, ...v, accuracy: v.correct / v.total }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .filter((t) => t.accuracy < 1);

    return (
      <div className="space-y-6">
        <section className="rounded-3xl border border-border bg-card p-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Session complete</p>
          <p className="mt-3 font-display text-6xl font-bold text-secondary dark:text-foreground">{percent}%</p>
          <p className="mt-2 text-muted-foreground">
            {correctCount} of {answers.length} correct · {formatClock(elapsed)} total
          </p>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 lg:p-8">
          <h2 className="mb-4 font-display text-xl font-bold text-secondary dark:text-foreground">Accuracy by topic</h2>
          <ul className="space-y-3">
            {[...byTopic.entries()].map(([key, v]) => {
              const [subject, topicId] = key.split(":");
              const pct = Math.round((v.correct / v.total) * 100);
              return (
                <li key={key}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-bold text-foreground">
                      {getTopicName(subject as never, topicId)}
                    </span>
                    <span className="text-muted-foreground">
                      {v.correct}/{v.total} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${pct >= 75 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-destructive"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          {weakest.length > 0 && (
            <p className="mt-6 rounded-2xl bg-accent px-5 py-4 text-sm leading-relaxed text-foreground">
              <strong className="font-bold">Focus next on {getTopicName(weakest[0].subject as never, weakest[0].key.split(":")[1])}.</strong>{" "}
              Questions you got wrong come back sooner — the schedule brings them
              forward automatically when you are signed in.
            </p>
          )}
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/csca/practice"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
          >
            <RotateCcw className="h-4 w-4" /> Practise again
          </Link>
          <Link
            href="/csca"
            className="flex-1 rounded-full border border-border px-8 py-4 text-center text-sm font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent"
          >
            Back to CSCA prep
          </Link>
        </div>
      </div>
    );
  }

  const answered = chosen !== null;

  return (
    <div className="space-y-5">
      <div className="sticky top-16 z-40 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/95 px-5 py-3 backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Question {index + 1} of {questions.length}
        </p>
        <div className="flex items-center gap-1" aria-hidden="true">
          {answers.map((a, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${a.correct ? "bg-success" : "bg-destructive"}`}
            />
          ))}
          {Array.from({ length: questions.length - answers.length }).map((_, i) => (
            <span key={`p-${i}`} className="h-2 w-2 rounded-full bg-muted" />
          ))}
        </div>
        <p className="font-mono text-sm tabular-nums text-muted-foreground">{formatClock(elapsed)}</p>
      </div>

      <article className="rounded-3xl border border-border bg-card p-6 lg:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-secondary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary dark:bg-accent dark:text-foreground">
            {getTopicName(question.subject, question.topicId)}
          </span>
          <span className="rounded-full bg-muted px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {question.difficulty}
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary-text">
            {SOURCE_LABELS[question.source]}
          </span>
        </div>

        <p className="text-lg leading-relaxed text-foreground lg:text-xl">{question.text}</p>

        <ul className="mt-6 space-y-3">
          {question.options.map((option, i) => {
            const isCorrect = i === question.correctIndex;
            const isChosen = i === chosen;

            let style = "border-border hover:border-primary/50 hover:bg-accent";
            if (answered && isCorrect) style = "border-success bg-success/10";
            else if (answered && isChosen) style = "border-destructive bg-destructive/10";
            else if (answered) style = "border-border opacity-60";

            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => choose(i)}
                  disabled={answered}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left transition-colors ${style}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 text-foreground">{option}</span>
                  {answered && isCorrect && <Check className="h-5 w-5 shrink-0 text-success" />}
                  {answered && isChosen && !isCorrect && <X className="h-5 w-5 shrink-0 text-destructive" />}
                </button>
              </li>
            );
          })}
        </ul>
      </article>

      {answered && (
        <article className="space-y-5 rounded-3xl border border-border bg-card p-6 lg:p-8">
          <p className={`font-display text-xl font-bold ${chosen === question.correctIndex ? "text-success" : "text-destructive"}`}>
            {chosen === question.correctIndex ? "Correct" : "Not quite"}
          </p>

          <div>
            <h3 className="mb-2 text-[10px] font-bold tracking-widest text-muted-foreground">
              <span className="uppercase">Working</span>
              {" — "}
              {/* Not uppercased: formulas carry pinyin and symbols that
                  uppercasing mangles (jìsuàn → JÌSUÀN). */}
              <span className="text-xs normal-case">{question.formula}</span>
            </h3>
            <ol className="space-y-2">
              {question.solutionSteps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground">
                  <span className="shrink-0 font-mono text-muted-foreground">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Why this matters</h3>
            <p className="text-sm leading-relaxed text-foreground">{question.explanation}</p>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <CircleAlert className="h-3 w-3" /> Where people lose the mark
            </h3>
            <ul className="space-y-3">
              {question.commonMistakes.map((m, i) => (
                <li key={i} className="rounded-xl bg-accent px-4 py-3 text-sm leading-relaxed">
                  <p className="text-foreground">
                    {m.option && <strong className="font-bold">{m.option}: </strong>}
                    {m.mistake}
                  </p>
                  <p className="mt-1 text-muted-foreground">{m.correction}</p>
                </li>
              ))}
            </ul>
          </div>

          {question.quickTip && (
            <p className="flex gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4 text-sm leading-relaxed text-foreground">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary-text" />
              <span>{question.quickTip}</span>
            </p>
          )}

          <button
            type="button"
            onClick={next}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
          >
            {index + 1 === questions.length ? "See results" : "Next question"} <ArrowRight className="h-4 w-4" />
          </button>
        </article>
      )}
    </div>
  );
};
