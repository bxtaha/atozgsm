"use client";

import { useEffect, useState } from "react";
import { heroRotatingWords } from "@/lib/site-config";

const ROTATE_MS = 2600;

export const RotatingWord = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % heroRotatingWords.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-grid text-primary align-bottom">
      <span aria-hidden="true" className="contents">
        {heroRotatingWords.map((word, i) => (
          <span
            key={word}
            className="col-start-1 row-start-1 transition-all duration-500 ease-out"
            style={{
              opacity: i === index ? 1 : 0,
              transform: i === index ? "translateY(0)" : "translateY(0.5rem)",
            }}
          >
            {word}
          </span>
        ))}
      </span>
      {/* Static text for screen readers, unaffected by the visual rotation */}
      <span className="sr-only">{heroRotatingWords[0]}</span>
    </span>
  );
};
