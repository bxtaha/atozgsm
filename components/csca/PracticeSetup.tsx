"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Play } from "lucide-react";
import { subjects, type SubjectId } from "@/lib/csca/syllabus";

const selectClass =
  "w-full appearance-none rounded-2xl border border-transparent bg-accent px-5 py-4 text-sm text-foreground outline-none transition-all focus:border-primary";

const labelClass = "mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground";

export const PracticeSetup = ({ initialSubject }: { initialSubject?: SubjectId }) => {
  const router = useRouter();
  const [subject, setSubject] = useState<string>(initialSubject ?? "");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [count, setCount] = useState("5");

  const topics = subjects.find((s) => s.id === subject)?.modules.flatMap((m) => m.topics) ?? [];

  const start = () => {
    const params = new URLSearchParams({ start: "1", count });
    if (subject) params.set("subject", subject);
    if (topic) params.set("topic", topic);
    if (difficulty) params.set("difficulty", difficulty);
    router.push(`/csca/practice?${params.toString()}`);
  };

  return (
    <div className="space-y-5 rounded-3xl border border-border bg-card p-6 lg:p-8">
      <div>
        <label htmlFor="subject" className={labelClass}>Subject</label>
        <select
          id="subject"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            setTopic("");
          }}
          className={selectClass}
        >
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {topics.length > 0 && (
        <div>
          <label htmlFor="topic" className={labelClass}>Topic</label>
          <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={selectClass}>
            <option value="">Every topic in this subject</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="difficulty" className={labelClass}>Difficulty</label>
          <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClass}>
            <option value="">Mixed</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label htmlFor="count" className={labelClass}>Questions</label>
          <select id="count" value={count} onChange={(e) => setCount(e.target.value)} className={selectClass}>
            {["5", "10", "15", "20"].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={start}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
      >
        <Play className="h-4 w-4" /> Start practice
      </button>
    </div>
  );
};
