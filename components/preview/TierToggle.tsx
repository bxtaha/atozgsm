"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { TIER_COOKIE } from "@/lib/tier";

/**
 * PREVIEW ONLY — lets a reviewer flip between the free and Premium views before
 * accounts exist. Remove this component when real authentication lands; it must
 * never ship to students, since anyone could use it to unlock paid content.
 */
export const TierToggle = () => {
  const router = useRouter();
  const [tier, setTier] = useState<"free" | "premium">("free");

  useEffect(() => {
    const current = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${TIER_COOKIE}=`))
      ?.split("=")[1];
    setTier(current === "premium" ? "premium" : "free");
  }, []);

  const switchTo = (next: "free" | "premium") => {
    document.cookie = `${TIER_COOKIE}=${next}; path=/; max-age=86400; samesite=lax`;
    setTier(next);
    router.refresh();
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur">
      <Eye className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Preview as
      </span>
      {(["free", "premium"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => switchTo(t)}
          aria-pressed={tier === t}
          className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
            tier === t
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:bg-accent"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
};
