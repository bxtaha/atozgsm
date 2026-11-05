"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, Search } from "lucide-react";
import { CATEGORY_LABELS, firstToneOf, vocabulary, type VocabCategory } from "@/lib/chinese/vocabulary";

const TONE_COLORS: Record<number, string> = {
  1: "text-primary-text",
  2: "text-success",
  3: "text-warning",
  4: "text-destructive",
  5: "text-muted-foreground",
};

export const VocabularyBrowser = () => {
  const [category, setCategory] = useState<VocabCategory | "">("");
  const [query, setQuery] = useState("");
  const [hideMeanings, setHideMeanings] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vocabulary.filter(
      (v) =>
        (!category || v.category === category) &&
        (!q || v.hanzi.includes(q) || v.pinyin.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q)),
    );
  }, [category, query]);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-secondary dark:text-foreground">Vocabulary</h2>
        <button
          type="button"
          onClick={() => setHideMeanings((h) => !h)}
          aria-pressed={hideMeanings}
          className="flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent"
        >
          {hideMeanings ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {hideMeanings ? "Meanings hidden" : "Hide meanings"}
        </button>
      </div>

      <p className="mb-5 max-w-2xl leading-relaxed text-muted-foreground">
        Hide the meanings to test yourself rather than read passively — recalling a word is what
        moves it into memory, and re-reading it mostly feels like progress without being any.
      </p>

      <div className="mb-5 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search characters, pinyin or meaning"
            aria-label="Search vocabulary"
            className="w-full rounded-2xl border border-transparent bg-accent py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("")}
            aria-pressed={category === ""}
            className={`rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              category === "" ? "bg-secondary text-secondary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {(Object.keys(CATEGORY_LABELS) as VocabCategory[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                category === c ? "bg-secondary text-secondary-foreground" : "bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{results.length} words</p>

      {results.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          Nothing matches that search.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((v) => (
            <li key={v.hanzi} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-baseline justify-between gap-2">
                <span lang="zh" className="font-display text-4xl font-bold text-foreground">{v.hanzi}</span>
                {v.hsk && (
                  <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    HSK {v.hsk}
                  </span>
                )}
              </div>

              <p className={`mt-2 text-lg font-bold ${TONE_COLORS[firstToneOf(v.pinyin)]}`}>{v.pinyin}</p>

              <p className={`mt-1 text-sm transition-opacity ${hideMeanings ? "select-none opacity-0" : "text-foreground"}`}>
                {v.meaning}
              </p>

              {v.example && !hideMeanings && (
                <div className="mt-3 border-t border-border pt-3">
                  <p lang="zh" className="text-sm text-foreground">{v.example.hanzi}</p>
                  <p className="mt-0.5 text-xs text-primary-text">{v.example.pinyin}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{v.example.english}</p>
                </div>
              )}

              {v.note && !hideMeanings && (
                <p className="mt-3 rounded-xl bg-accent px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                  {v.note}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
