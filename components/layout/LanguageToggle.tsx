import { Languages } from "lucide-react";

export const LanguageToggle = () => (
  <button
    type="button"
    data-language-toggle
    translate="no"
    aria-label="Switch to Simplified Chinese"
    aria-pressed="false"
    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <Languages className="h-4 w-4" aria-hidden="true" />
    <span>中文</span>
  </button>
);
