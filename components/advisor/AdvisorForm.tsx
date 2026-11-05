"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics/meta-pixel";

const LEVELS = [
  { value: "bachelor", label: "Bachelor's" },
  { value: "master", label: "Master's" },
  { value: "diploma", label: "Diploma" },
  { value: "language", label: "Language programme" },
];

const inputClass =
  "w-full rounded-2xl border border-transparent bg-accent px-5 py-4 text-sm outline-none transition-all focus:border-secondary";

export const AdvisorForm = () => {
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [brief, setBrief] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim().length < 20) {
      setError("Please write at least a sentence or two about your results and what you want to study.");
      return;
    }

    setLoading(true);
    setError("");
    setBrief("");

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: goal.trim(),
          locale: document.documentElement.lang === "zh-CN" ? "zh-CN" : "en",
          level: level || undefined,
          subject: subject.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setBrief(data.brief);
      trackEvent("AdvisorBriefGenerated", { study_level: level || "unspecified" });
    } catch {
      setError("We couldn't reach the advisor. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="space-y-5 rounded-3xl border border-border bg-card p-6 lg:p-8">
        <div>
          <label htmlFor="goal" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Tell us about your results and what you want to study
          </label>
          <textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={5}
            placeholder="Example: I finished HSC in 2024 with GPA 4.5 in science. I want to study computer science in China and I need a scholarship because my family can pay about 2 lakh taka per year."
            className={`${inputClass} min-h-[120px] resize-y`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="level" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Study level
            </label>
            <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} className={`${inputClass} cursor-pointer appearance-none`}>
              <option value="">Not sure yet</option>
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Subject (optional)
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Computer Science"
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Reading your case…" : "Get my brief"}
        </button>
      </form>

      {brief && (
        <article className="rounded-3xl border border-border bg-card p-6 lg:p-8">
          <h2 className="mb-4 font-display text-xl font-bold text-secondary">Your brief</h2>
          <div className="space-y-4 leading-relaxed text-foreground">
            {brief.split("\n").filter(Boolean).map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            This is general guidance generated from what you wrote — not an assessment of your
            application, and not a decision from any university. Requirements differ per university
            and change over time. Always confirm against the university&apos;s own current published
            requirements.
          </p>
        </article>
      )}
    </div>
  );
};
