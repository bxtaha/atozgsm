"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search, X } from "lucide-react";
import { CATEGORY_LABELS, LANGUAGE_LABELS, LEVEL_LABELS } from "@/lib/universities/format";

const selectClass =
  "w-full appearance-none rounded-2xl border border-transparent bg-accent px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-secondary";

export const DirectoryFilters = ({ cities }: { cities: string[] }) => {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.replace(`/universities?${next.toString()}`, { scroll: false });
    },
    [params, router],
  );

  const hasFilters = Array.from(params.keys()).length > 0;

  return (
    <div className="rounded-3xl border border-border bg-card p-5 lg:p-6">
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          defaultValue={params.get("q") ?? ""}
          onChange={(e) => update("q", e.target.value)}
          placeholder="Search by city or subject (e.g. Computer Science)"
          aria-label="Search universities by city or subject"
          className="w-full rounded-2xl border border-transparent bg-accent py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-secondary"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">City</span>
          <select value={params.get("city") ?? ""} onChange={(e) => update("city", e.target.value)} className={selectClass}>
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Study level</span>
          <select value={params.get("level") ?? ""} onChange={(e) => update("level", e.target.value)} className={selectClass}>
            <option value="">All levels</option>
            {Object.entries(LEVEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Language</span>
          <select value={params.get("language") ?? ""} onChange={(e) => update("language", e.target.value)} className={selectClass}>
            <option value="">Any language</option>
            {Object.entries(LANGUAGE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</span>
          <select value={params.get("category") ?? ""} onChange={(e) => update("category", e.target.value)} className={selectClass}>
            <option value="">All categories</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => router.replace("/universities", { scroll: false })}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary-text"
        >
          <X className="h-3 w-3" /> Clear filters
        </button>
      )}
    </div>
  );
};
