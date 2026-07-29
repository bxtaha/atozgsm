"use client";

import React, { useEffect, useRef, ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "green" | "red" | "orange" | "gold";
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  customSize?: boolean; // When true, ignores size prop and uses width/height or className
  /** CSS color for the card's own background (the `--backdrop` custom property). */
  backdropColor?: string;
  /** Corner radius in px — keep in sync with whatever `rounded-*` class the caller uses. */
  radius?: number;
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
  // Narrow spread keeps the spotlight a consistent warm gold rather than
  // hue-shifting through the palette as the cursor crosses the viewport.
  gold: { base: 46, spread: 20 },
};

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
};

// --- Shared pointermove listener (module-level singleton) ---
//
// Each GlowCard used to register its own `document`-level pointermove
// listener and write --x/--xp/--y/--yp onto its own element on every event.
// With ~18 cards on the page that's dozens of style writes per pointer
// move (60-120Hz). Since CSS custom properties inherit down the DOM tree,
// we only need to write them once, on `document.documentElement` — every
// card's own inline styles (which reference `var(--x, 0)` etc.) pick the
// value up from the ancestor automatically. A simple refcount lets the
// listener attach on first mount and detach on last unmount.
let sharedPointerListenerCount = 0;
let sharedPointerMoveHandler: ((e: PointerEvent) => void) | null = null;

function acquireSharedPointerListener() {
  sharedPointerListenerCount += 1;
  if (sharedPointerListenerCount === 1 && typeof document !== "undefined") {
    const root = document.documentElement;

    // Seed a reasonable default before the first real pointermove event (and
    // permanently on touch-only devices with no mouse) so no card shows a
    // stray spotlight anchored at (0,0) — the top-left corner — on load.
    root.style.setProperty("--x", "-1000");
    root.style.setProperty("--xp", "-1");
    root.style.setProperty("--y", "-1000");
    root.style.setProperty("--yp", "-1");

    sharedPointerMoveHandler = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      root.style.setProperty("--x", x.toFixed(2));
      root.style.setProperty("--xp", (x / window.innerWidth).toFixed(2));
      root.style.setProperty("--y", y.toFixed(2));
      root.style.setProperty("--yp", (y / window.innerHeight).toFixed(2));
    };

    document.addEventListener("pointermove", sharedPointerMoveHandler);
  }
}

function releaseSharedPointerListener() {
  sharedPointerListenerCount = Math.max(0, sharedPointerListenerCount - 1);
  if (sharedPointerListenerCount === 0 && sharedPointerMoveHandler) {
    document.removeEventListener("pointermove", sharedPointerMoveHandler);
    sharedPointerMoveHandler = null;
  }
}

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  glowColor = "blue",
  size = "md",
  width,
  height,
  customSize = false,
  backdropColor = "hsl(0 0% 60% / 0.12)",
  radius = 14,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    acquireSharedPointerListener();
    return () => releaseSharedPointerListener();
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  // Determine sizing
  const getSizeClasses = () => {
    if (customSize) {
      return ""; // Let className or inline styles handle sizing
    }
    return sizeMap[size];
  };

  const getInlineStyles = () => {
    const baseStyles: React.CSSProperties & Record<string, string | number> = {
      "--base": base,
      "--spread": spread,
      "--radius": radius,
      "--border": "3",
      "--backdrop": backdropColor,
      "--backup-border": "var(--backdrop)",
      "--size": "200",
      "--outer": "1",
      "--border-size": "calc(var(--border, 2) * 1px)",
      "--spotlight-size": "calc(var(--size, 150) * 1px)",
      "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
      )`,
      backgroundColor: "var(--backdrop, transparent)",
      backgroundSize: "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
      backgroundPosition: "50% 50%",
      backgroundAttachment: "fixed",
      border: "var(--border-size) solid var(--backup-border)",
      borderRadius: `calc(var(--radius) * 1px)`,
      position: "relative" as const,
    };

    // Add width and height if provided
    if (width !== undefined) {
      baseStyles.width = typeof width === "number" ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === "number" ? `${height}px` : height;
    }

    return baseStyles;
  };

  return (
    <div
      ref={cardRef}
      data-glow
      style={getInlineStyles()}
      className={
        customSize
          ? `relative ${getSizeClasses()} ${className}`
          : `
        ${getSizeClasses()}
        aspect-[3/4]
        rounded-2xl
        relative
        grid
        grid-rows-[1fr_auto]
        shadow-[0_1rem_2rem_-1rem_black]
        p-4
        gap-4
        backdrop-blur-[5px]
        ${className}
      `
      }
    >
      <div data-glow></div>
      {children}
    </div>
  );
};

export { GlowCard };
