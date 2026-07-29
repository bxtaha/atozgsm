# ChinaAdmit Navy & Gold Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the atozgsm landing page's dark neon "tech console" theme with a bright, trustworthy, premium Navy & Gold visual system, keeping all content, structure, routes, and form logic unchanged.

**Architecture:** This is a token-driven reskin. Most components consume shared CSS custom properties (`--primary`, `--secondary`, `--background`, `--console-surface`, etc.) via Tailwind semantic classes (`bg-primary`, `text-secondary`, `bg-console-surface`...), so redefining those tokens in `app/globals.css` recolors most of the page automatically. A smaller set of components need explicit edits because the current code hardcodes a "dark page, bright accent" assumption (e.g. the hero forces a photo-on-dark-background look; the closing CTA/Contact/Footer band needs to *stay* navy while the rest of the page goes light).

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS (HSL CSS-variable tokens), `next/font/google`.

## Global Constraints

- Design spec: `docs/superpowers/specs/2026-07-29-landing-page-redesign-design.md` — palette, section rhythm (white/cream page, navy hero + navy closing band), gold-top-accent cards, no content/structure/logic changes.
- No new dependencies. Use `next/font/google` for fonts, same mechanism as the existing `Space_Grotesk` setup.
- Do not use `Inter`, `Roboto`, `Fraunces`, `Geist`, `Plus Jakarta Sans`, or `Space Grotesk` (flagged overused). This plan uses `Source_Serif_4` (headlines) and `Work_Sans` (body).
- Verification is visual (no new unit tests) — the dev server on port 8091 must be running; use the browser tools to reload and confirm each task before committing (per `docs/superpowers/specs/2026-07-29-landing-page-redesign-design.md`'s Testing section).
- Branch: `claude` (already created and checked out). Commit after every task.

---

### Task 1: Global design tokens (colors)

**Files:**
- Modify: `app/globals.css:6-52` (the `:root` token block)
- Modify: `tailwind.config.ts:63-70` (remove tokens dropped from globals.css)

**Interfaces:**
- Produces: the recolored `--background`, `--foreground`, `--primary` (gold), `--primary-foreground` (navy), `--secondary` (navy), `--secondary-foreground` (cream), `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--border`, `--input`, `--ring`, `--console-surface` (now white) tokens every later task relies on.

- [ ] **Step 1: Replace the `:root` token block**

In `app/globals.css`, replace lines 6–52 with:

```css
  :root {
    --background: 40 45% 96%;
    --foreground: 220 43% 11%;

    --card: 0 0% 100%;
    --card-foreground: 220 43% 11%;

    --popover: 0 0% 100%;
    --popover-foreground: 220 43% 11%;

    --primary: 46 65% 52%;
    --primary-foreground: 214 68% 14%;

    --secondary: 214 68% 14%;
    --secondary-foreground: 40 45% 96%;

    --muted: 40 30% 93%;
    --muted-foreground: 221 13% 46%;

    --accent: 40 40% 92%;
    --accent-foreground: 214 68% 14%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 220 20% 88%;
    --input: 40 30% 95%;
    --ring: 46 65% 52%;

    --radius: 1rem;

    --console-surface: 0 0% 100%;
    --text-dim: 221 13% 46%;

    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
```

This drops `--console-base`, `--console-key`, `--glow-mint`, `--glow-pink` (confirmed unused as Tailwind classes anywhere in `components/` or `app/` — only referenced by their own now-removed CSS rules). `--console-surface` is kept (used as `bg-console-surface` in 7 components) and repointed to white. `--text-dim` is kept as-is (unused today but harmless; not in scope to remove unrelated sidebar/text-dim tokens).

- [ ] **Step 2: Remove the now-dead `.glow-mint` / `.glow-pink` utilities**

In `app/globals.css`, delete the `@layer utilities` block (was lines 81–88):

```css
@layer utilities {
  .glow-mint {
    box-shadow: 0 0 20px hsl(var(--primary) / 0.3);
  }
  .glow-pink {
    box-shadow: 0 0 20px hsl(var(--secondary) / 0.3);
  }
}
```

Confirmed via `grep -rn "glow-mint\|glow-pink" --include="*.tsx"` that neither class is applied anywhere, so this is dead code, not a behavior change.

- [ ] **Step 3: Remove dropped color registrations from Tailwind config**

In `tailwind.config.ts`, replace:

```ts
        "console-base": "hsl(var(--console-base))",
        "console-surface": "hsl(var(--console-surface))",
        "console-key": "hsl(var(--console-key))",
        "glow-mint": "hsl(var(--glow-mint))",
        "glow-pink": "hsl(var(--glow-pink))",
        "text-dim": "hsl(var(--text-dim))",
```

with:

```ts
        "console-surface": "hsl(var(--console-surface))",
        "text-dim": "hsl(var(--text-dim))",
```

- [ ] **Step 4: Verify in the browser**

The atozgsm dev server is already running on port 8091. Reload `http://localhost:8091` (or open it if the tab isn't open), take a screenshot, and confirm: page background is now cream/white (not black), body text is dark, cards/buttons render in gold/navy rather than mint/pink. Check `read_console_messages` for errors (a missing CSS var would show as `hsl(var(--x))` silently falling back — visually verify colors actually changed, don't just check for JS errors).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css tailwind.config.ts
git commit -m "Replace dark neon theme tokens with Navy & Gold palette"
```

---

### Task 2: Typography — serif headline + sans body

**Files:**
- Modify: `app/layout.tsx:1-11,47`
- Modify: `app/globals.css:55-64` (the `body` font-family rule)
- Modify: `tailwind.config.ts:16-18` (`fontFamily.display`)

**Interfaces:**
- Produces: `font-display` Tailwind class now resolves to the serif face; body text uses the new sans face. Later tasks add `className="font-display"` to `<h1>`/`<h2>`/`<h3>` elements.

- [ ] **Step 1: Swap the Google Fonts import in the root layout**

In `app/layout.tsx`, replace:

```tsx
import { Space_Grotesk } from "next/font/google";
```
```tsx
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});
```

with:

```tsx
import { Source_Serif_4, Work_Sans } from "next/font/google";
```
```tsx
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-source-serif",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-work-sans",
});
```

Then in the same file, replace:

```tsx
    <html lang="en" className={spaceGrotesk.variable}>
```

with:

```tsx
    <html lang="en" className={`${sourceSerif.variable} ${workSans.variable}`}>
```

- [ ] **Step 2: Point the body font-family and `font-display` at the new variables**

In `app/globals.css`, replace:

```css
  body {
    @apply bg-background text-foreground antialiased;
    font-family: var(--font-space-grotesk), 'Space Grotesk', sans-serif;
  }
```

with:

```css
  body {
    @apply bg-background text-foreground antialiased;
    font-family: var(--font-work-sans), 'Work Sans', sans-serif;
  }
```

In `tailwind.config.ts`, replace:

```ts
      fontFamily: {
        display: ["var(--font-space-grotesk)", "'Space Grotesk'", "sans-serif"],
      },
```

with:

```ts
      fontFamily: {
        display: ["var(--font-source-serif)", "'Source Serif 4'", "serif"],
      },
```

- [ ] **Step 3: Verify in the browser**

Reload the page. Body copy should visibly be a plain sans-serif (Work Sans), not the old geometric Space Grotesk. Headings won't look different yet — `font-display` isn't applied to any heading until Task 3+. Check console for font-loading errors.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css tailwind.config.ts
git commit -m "Swap Space Grotesk for Source Serif 4 / Work Sans pairing"
```

---

### Task 3: Nav bar + Hero band

**Files:**
- Modify: `components/LandingPage.tsx:23-38` (nav)
- Modify: `components/landing/HeroBanner.tsx` (whole file)

**Interfaces:**
- Consumes: `font-display` class from Task 2; `--primary` (gold), `--secondary` (navy) tokens from Task 1.

- [ ] **Step 1: Restyle the sticky nav**

In `components/LandingPage.tsx`, replace the `<nav>` block (lines 23–38) with:

```tsx
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-display font-bold tracking-tight text-lg text-secondary">🎓 ChinaAdmit</span>
          <div className="hidden md:flex items-center gap-6 text-xs font-bold tracking-wider uppercase text-muted-foreground">
            <a href="#benefits" className="hover:text-primary transition-colors">Benefits</a>
            <a href="#programs" className="hover:text-primary transition-colors">Programs</a>
            <a href="#process" className="hover:text-primary transition-colors">Process</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Stories</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <a href="#apply" className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase hover:brightness-110 transition-all">
            Apply Now
          </a>
        </div>
      </nav>
```

(Only change: wordmark gets `font-display text-secondary` so it reads as a navy serif logo instead of plain white text.)

- [ ] **Step 2: Force the hero band navy regardless of the new light page background**

`HeroBanner.tsx` currently leans on `bg-background`/`text-foreground`/`text-primary`, which after Task 1 would make the hero cream instead of navy. Replace the whole file with:

```tsx
import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner = () => (
  <section className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden bg-secondary">
    {/* Background image */}
    <img
      src={heroBanner.src}
      alt="Students walking on a modern Chinese university campus at golden hour"
      width={1920}
      height={864}
      loading="eager"
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* Navy overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-secondary/85 via-secondary/70 to-secondary" />

    {/* Ambient glows */}
    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

    {/* Content */}
    <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6 animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-foreground/10 backdrop-blur border border-secondary-foreground/20">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-bold text-primary tracking-widest uppercase">
          Eligibility: Ages 18–25
        </span>
      </div>

      <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-secondary-foreground text-balance">
        Your Dream University in China{" "}
        <span className="text-primary">Starts Here</span>
      </h1>

      <p className="text-secondary-foreground/80 text-base lg:text-xl max-w-2xl mx-auto leading-relaxed">
        Scholarship guidance, application support, document checking, and visa prep — 
        with a clear, step-by-step process for Bangladeshi students.
      </p>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        {["Real office & verified counselors", "Transparent fees", "Fast response within 24 hours"].map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 text-xs text-secondary-foreground/80 bg-secondary-foreground/10 backdrop-blur px-3 py-1.5 rounded-full border border-secondary-foreground/20"
          >
            <span className="text-primary">✓</span> {t}
          </span>
        ))}
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="#apply"
          className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-bold tracking-wider uppercase hover:brightness-105 transition-all shadow-lg shadow-primary/25"
        >
          Get Free Counseling
        </a>
        <a
          href="#programs"
          className="px-8 py-3.5 rounded-full border border-secondary-foreground/30 text-sm font-bold tracking-wider uppercase text-secondary-foreground/80 hover:text-secondary-foreground hover:border-primary/50 transition-colors"
        >
          Explore Programs
        </a>
      </div>

      {/* Stats row */}
      <div className="pt-8 flex flex-wrap justify-center gap-8 lg:gap-12">
        {[
          { value: "20,000+", label: "BD Students in China" },
          { value: "92%", label: "Scholarship Success" },
          { value: "97%", label: "Visa Approval Rate" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-primary">{s.value}</div>
            <div className="text-xs text-secondary-foreground/70 tracking-wider uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom fade into the page background */}
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-secondary to-transparent" />
  </section>
);

export default HeroBanner;
```

Key changes from the original: explicit `bg-secondary` (navy) on the `<section>` so it stays navy no matter what `--background` is; overlay/badges/pills use `secondary-foreground` (cream) at various opacities instead of `foreground`/`background`; headline gets `font-display`; bottom fade gradient now fades from `secondary` (navy) instead of `background`, so it blends into the next (white) section correctly.

- [ ] **Step 3: Verify in the browser**

Reload. Confirm: nav is a light bar with a navy serif wordmark; hero section is a navy band with the campus photo, cream serif headline, gold "Starts Here" span, gold stat numbers, gold CTA button; the hero-to-page transition at the bottom fades navy → cream cleanly (not navy → black or a hard cut). Check console for errors.

- [ ] **Step 4: Commit**

```bash
git add components/LandingPage.tsx components/landing/HeroBanner.tsx
git commit -m "Restyle nav and hero band for Navy & Gold theme"
```

---

### Task 4: Stats, Benefits, Programs sections

**Files:**
- Modify: `components/landing/StatsBar.tsx` (heading font only — colors already flow from Task 1 tokens)
- Modify: `components/landing/BenefitsSection.tsx`
- Modify: `components/landing/ProgramsSection.tsx`

**Interfaces:**
- Consumes: `font-display`, gold `--primary`, navy `--secondary`, white `--console-surface` from Tasks 1–2.

- [ ] **Step 1: StatsBar — no color changes needed, confirm and leave as-is**

`StatsBar.tsx` uses `text-primary` for values and `text-muted-foreground` for labels — both already resolve to gold-on-white and readable gray after Task 1. No edit needed here; this step is just the verification checkpoint (view the section, confirm the 4 stats render in gold on the now-white/cream background with a visible border below — `border-border` is no longer invisible-on-black since Task 1 changed it to a visible light gray).

- [ ] **Step 2: Benefits cards — gold top accent + navy icon badges + serif heading**

In `components/landing/BenefitsSection.tsx`, replace:

```tsx
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-5xl font-bold mb-4">Why Choose Us?</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Everything you need to make studying in China simple, affordable, and stress-free.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((b) => (
          <div key={b.title} className="bg-console-surface border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
              <b.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-xl mb-2">{b.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
```

with:

```tsx
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">Why Choose Us?</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Everything you need to make studying in China simple, affordable, and stress-free.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((b) => (
          <div key={b.title} className="bg-console-surface border border-border border-t-4 border-t-primary rounded-2xl p-8 shadow-[0_8px_24px_rgba(11,31,58,0.06)] hover:shadow-[0_12px_32px_rgba(11,31,58,0.1)] transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
              <b.icon className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">{b.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
```

- [ ] **Step 3: Programs cards — same gold-top-accent card treatment + serif heading**

In `components/landing/ProgramsSection.tsx`, replace:

```tsx
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-5xl font-bold mb-4">Programs & Services</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">We support all degree levels — from foundation to PhD.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((p) => (
          <div key={p.level} className="bg-console-surface border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">{p.level}</h3>
```

with:

```tsx
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">Programs & Services</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">We support all degree levels — from foundation to PhD.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((p) => (
          <div key={p.level} className="bg-console-surface border border-border border-t-4 border-t-primary rounded-2xl p-8 shadow-[0_8px_24px_rgba(11,31,58,0.06)] hover:shadow-[0_12px_32px_rgba(11,31,58,0.1)] transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl font-bold">{p.level}</h3>
```

(The rest of the `ProgramsSection.tsx` card body — duration pill, description, tag list — already uses token-driven classes and needs no changes.)

- [ ] **Step 4: Verify in the browser**

Reload, scroll to Benefits and Programs. Confirm every card has a visible ~4px gold line across its top edge, a soft shadow instead of a hard border-glow, benefits icons sit in navy-tinted circles with navy icons, and card/section titles render in the serif display font.

- [ ] **Step 5: Commit**

```bash
git add components/landing/StatsBar.tsx components/landing/BenefitsSection.tsx components/landing/ProgramsSection.tsx
git commit -m "Apply gold-accent cards and navy icon badges to Benefits/Programs"
```

---

### Task 5: Process section — solid gold step circles + navy connector

**Files:**
- Modify: `components/landing/ProcessSection.tsx`

**Interfaces:**
- Consumes: gold `--primary`, navy `--secondary`, `font-display` from prior tasks.

- [ ] **Step 1: Restyle the timeline**

Replace the full body of `components/landing/ProcessSection.tsx` with:

```tsx
const steps = [
  { num: "01", title: "Free Consultation", desc: "Talk to our counselors — assess your eligibility and explore programs." },
  { num: "02", title: "Document Preparation", desc: "We review and prepare your academic documents, transcripts, and certificates." },
  { num: "03", title: "University Application", desc: "We submit your application to matched universities and track progress." },
  { num: "04", title: "Scholarship & Admission", desc: "Receive your offer letter and scholarship confirmation." },
  { num: "05", title: "Visa & Pre-Departure", desc: "Visa application support, JW202 guidance, airport pickup, and orientation." },
];

const ProcessSection = () => (
  <section className="py-24 px-4 border-t border-border" id="process">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">How It Works</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">A clear, step-by-step process from first contact to campus arrival.</p>
      </div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-secondary/30 hidden md:block" />
        <div className="space-y-8">
          {steps.map((s) => (
            <div key={s.num} className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 relative z-10 shadow-[0_4px_14px_rgba(212,175,55,0.35)]">
                <span className="text-sm font-bold text-primary-foreground">{s.num}</span>
              </div>
              <div className="pt-1">
                <h3 className="font-display font-bold text-xl mb-1">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ProcessSection;
```

Changes: step badges are now `rounded-full bg-primary` (solid gold circle) with `text-primary-foreground` (navy digits) instead of a 10%-opacity square; the connector line is `bg-secondary/30` (navy) instead of the generic border color; section/step titles get `font-display`.

- [ ] **Step 2: Verify in the browser**

Reload, scroll to the Process section. Confirm 5 solid gold circles with navy numerals connected by a thin navy vertical line on desktop width.

- [ ] **Step 3: Commit**

```bash
git add components/landing/ProcessSection.tsx
git commit -m "Restyle Process timeline with solid gold circles and navy connector"
```

---

### Task 6: Testimonials + FAQ

**Files:**
- Modify: `components/landing/TestimonialsSection.tsx`
- Modify: `components/landing/FAQSection.tsx`

**Interfaces:**
- Consumes: gold `--primary`, `font-display`, `--console-surface` (white) from prior tasks. No shared interfaces produced.

- [ ] **Step 1: Testimonials — cream section band + gold-accent cards**

In `components/landing/TestimonialsSection.tsx`, replace:

```tsx
const TestimonialsSection = () => (
  <section className="py-24 px-4 border-t border-border" id="testimonials">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-5xl font-bold mb-4">Student Success Stories</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Hear from Bangladeshi students who made it to China with our help.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-console-surface border border-border rounded-2xl p-8 flex flex-col">
            <div className="text-4xl text-primary/30 mb-4">"</div>
```

with:

```tsx
const TestimonialsSection = () => (
  <section className="py-24 px-4 border-t border-border bg-muted/40" id="testimonials">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">Student Success Stories</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Hear from Bangladeshi students who made it to China with our help.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-console-surface border border-border border-t-4 border-t-primary rounded-2xl p-8 flex flex-col shadow-[0_8px_24px_rgba(11,31,58,0.06)]">
            <div className="text-4xl text-primary/60 mb-4">"</div>
```

(`bg-muted/40` gives the section a soft cream tint distinct from the pure-white Benefits/Programs sections above/below it, per the spec's "cream band breaks up the white sections.")

- [ ] **Step 2: FAQ — navy header text, gold-accent items, light-scheme date-picker parity check (n/a here, just header)**

In `components/landing/FAQSection.tsx`, replace:

```tsx
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground text-lg">Still unsure? Ask us — free.</p>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="bg-console-surface border border-border rounded-2xl px-6 data-[state=open]:border-primary/30">
            <AccordionTrigger className="font-bold text-left py-5 hover:no-underline hover:text-primary">{f.q}</AccordionTrigger>
```

with:

```tsx
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground text-lg">Still unsure? Ask us — free.</p>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="bg-console-surface border border-border rounded-2xl px-6 data-[state=open]:border-primary/50">
            <AccordionTrigger className="font-bold text-left py-5 text-secondary hover:no-underline hover:text-primary">{f.q}</AccordionTrigger>
```

(Chevron icon inside `AccordionTrigger` inherits `currentColor`, so it goes navy by default and gold on hover automatically — no separate edit needed.)

- [ ] **Step 3: Verify in the browser**

Reload, scroll to Testimonials (confirm cream-tinted band, gold-top-accent cards, larger gold quote mark) and FAQ (confirm navy question text that turns gold on hover, gold border ring when an item is open).

- [ ] **Step 4: Commit**

```bash
git add components/landing/TestimonialsSection.tsx components/landing/FAQSection.tsx
git commit -m "Restyle Testimonials and FAQ sections for Navy & Gold theme"
```

---

### Task 7: Application form module

**Files:**
- Modify: `components/LandingPage.tsx:52-64` (form section wrapper)
- Modify: `components/landing/HeroSection.tsx` (embedded left panel)
- Modify: `components/landing/ApplicationForm.tsx:236,309,332` (date input color-scheme, submit button surface, heading — no validation/logic changes)

**Interfaces:**
- Consumes: `--console-surface` (white), `--secondary` (navy), `--primary` (gold) tokens; `font-display`.
- No changes to `FormData`, validation functions, or `onSuccess` — purely visual.

- [ ] **Step 1: Form section wrapper — soften the shadow for a light page**

In `components/LandingPage.tsx`, replace:

```tsx
      <section className="flex items-center justify-center p-4 lg:p-8 relative z-10 py-12 lg:py-20 border-t border-border" id="apply">
        <div className="w-full max-w-6xl bg-console-surface rounded-[2.5rem] p-3 lg:p-4 ring-1 ring-border shadow-[0_20px_50px_rgba(0,0,0,0.5)] grid lg:grid-cols-12 gap-4 animate-fade-in">
          <HeroSection />
          <div className="lg:col-span-7 bg-background/50 rounded-[2rem] p-5 lg:p-10 flex flex-col justify-center border border-border relative">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Start Your Application</h2>
```

with:

```tsx
      <section className="flex items-center justify-center p-4 lg:p-8 relative z-10 py-12 lg:py-20 border-t border-border" id="apply">
        <div className="w-full max-w-6xl bg-console-surface rounded-[2.5rem] p-3 lg:p-4 ring-1 ring-border shadow-[0_20px_50px_rgba(11,31,58,0.12)] grid lg:grid-cols-12 gap-4 animate-fade-in">
          <HeroSection />
          <div className="lg:col-span-7 bg-card rounded-[2rem] p-5 lg:p-10 flex flex-col justify-center border border-border relative">
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold mb-2 text-secondary">Start Your Application</h2>
```

- [ ] **Step 2: Embedded HeroSection panel — make it a navy companion to the main hero**

Replace the full body of `components/landing/HeroSection.tsx` with:

```tsx
import campusHero from "@/assets/campus-hero.jpg";

const StatBar = ({ label, value, percentage, color }: { label: string; value: string; percentage: number; color: "mint" | "pink" }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold tracking-wider uppercase">
      <span className="text-secondary-foreground/80">{label}</span>
      <span className={color === "mint" ? "text-primary" : "text-secondary-foreground"}>{value}</span>
    </div>
    <div className="h-2 bg-secondary-foreground/10 rounded-full overflow-hidden p-[1px]">
      <div
        className={`h-full rounded-full animate-bar-fill ${color === "mint" ? "bg-primary" : "bg-secondary-foreground/60"}`}
        style={{ "--bar-width": `${percentage}%`, width: `${percentage}%` } as React.CSSProperties}
      />
    </div>
  </div>
);

const HeroSection = () => (
  <div className="lg:col-span-5 bg-secondary rounded-[2rem] p-6 lg:p-10 flex flex-col justify-between relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

    <div className="relative z-10">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-foreground/10 border border-secondary-foreground/20 mb-6">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-bold text-primary tracking-widest uppercase">Eligibility: Ages 18–25</span>
      </div>

      <h1 className="font-display text-3xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-5 text-secondary-foreground text-balance">
        Get Admission Support for China Universities — From Bangladesh
      </h1>
      <p className="text-secondary-foreground/80 text-base lg:text-lg max-w-[40ch] leading-relaxed">
        Scholarship guidance, application support, document checking, and visa prep — with a clear, step-by-step process.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {["Real office & verified counselors", "Transparent fees", "Fast response within 24 hours"].map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5 text-xs text-secondary-foreground/80 bg-secondary-foreground/10 px-3 py-1.5 rounded-full border border-secondary-foreground/20">
            <span className="text-primary">✓</span> {t}
          </span>
        ))}
      </div>

      <div className="mt-6 rounded-2xl overflow-hidden ring-1 ring-secondary-foreground/20">
        <img
          src={campusHero.src}
          alt="University campus in China with Bangladeshi students"
          width={1920}
          height={1080}
          loading="eager"
          className="w-full h-40 lg:h-48 object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
        />
      </div>
    </div>

    <div className="mt-8 space-y-4 relative z-10">
      <StatBar label="~20,000 BD Students in China" value="REPORTED" percentage={85} color="mint" />
      <StatBar label="Scholarship Success Rate" value="92%" percentage={92} color="pink" />
      <StatBar label="Visa Approval Rate" value="97%" percentage={97} color="mint" />
    </div>
  </div>
);

export default HeroSection;
```

(The `"mint"`/`"pink"` prop values are kept as-is — they're just internal labels the component uses to pick a bar color, not user-facing copy, so renaming them isn't required and would only add risk. `"mint"` now renders gold, `"pink"` now renders a lighter navy/cream tone.)

- [ ] **Step 3: ApplicationForm — light-scheme date picker, gold-tinted submit button, no logic changes**

In `components/landing/ApplicationForm.tsx`, change line 236 from:

```tsx
                className="console-input [color-scheme:dark]" />
```

to:

```tsx
                className="console-input [color-scheme:light]" />
```

No change needed for the submit button surface (`components/landing/ApplicationForm.tsx:308`, `bg-console-surface`) — it already resolves to white via Task 1's token change, which correctly shows through the gold/navy gradient border ring around it. Checked, not missed — no edit here.

- [ ] **Step 4: Verify in the browser**

Reload, scroll to the application form. Confirm: the left panel is now a navy twin of the main hero (photo, gold eyebrow, cream headline, gold/cream stat bars); the right panel (form) is white with a navy "Start Your Application" heading; clicking into the Date of Birth field shows a light-themed native date picker, not a dark one; clicking into the Phone field shows a navy focus ring, other fields show a gold focus ring; submitting still navigates to `/thank-you` (click through Step 1 → Step 2 → Submit with valid data to confirm no regression).

- [ ] **Step 5: Commit**

```bash
git add components/LandingPage.tsx components/landing/HeroSection.tsx components/landing/ApplicationForm.tsx
git commit -m "Restyle application form module for Navy & Gold theme"
```

---

### Task 8: Closing navy band — CTA, Contact, Footer

**Files:**
- Modify: `components/landing/CTASection.tsx`
- Modify: `components/landing/ContactSection.tsx`
- Modify: `components/landing/FooterSection.tsx`

**Interfaces:**
- Consumes: `--secondary` (navy), `--primary` (gold), `font-display` from prior tasks. These three sections together form the page's closing navy band (mirrors the hero) — no shared code interface between them beyond the tokens.

- [ ] **Step 1: CTASection — navy band, gold button**

Replace the full body of `components/landing/CTASection.tsx` with:

```tsx
const CTASection = () => (
  <section className="pt-24 pb-16 px-4 bg-secondary">
    <div className="max-w-3xl mx-auto text-center">
      <div className="relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-foreground/10 border border-secondary-foreground/20">
            <span className="text-xs font-bold tracking-wider uppercase text-secondary-foreground/80">📌 Important</span>
          </div>

          <h2 className="font-display text-3xl lg:text-4xl font-bold text-secondary-foreground">
            Ready to Start Your Journey?
          </h2>
          <p className="text-secondary-foreground/80 text-lg max-w-lg mx-auto">
            Fill out the form below and a counselor will reach out within 24 hours. It's 100% free.
          </p>

          <a
            href="#apply"
            className="inline-block px-10 py-4 rounded-full bg-primary text-primary-foreground text-base font-bold tracking-wider uppercase hover:brightness-105 transition-all shadow-[0_0_30px_hsl(var(--primary)/0.35)]"
          >
            Get Free Counseling
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
```

(This section now starts the navy band that continues through Contact and Footer, so it drops its own card shell — `bg-console-surface`/`border`/`rounded-3xl` — in favor of `bg-secondary` directly on the `<section>`, matching how the design spec bookends the page.)

- [ ] **Step 2: ContactSection — navy band, translucent cards**

Replace the full body of `components/landing/ContactSection.tsx` with:

```tsx
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const contacts = [
  { icon: MapPin, label: "Office Address", value: "House 12, Road 5, Block C, Banani, Dhaka 1213, Bangladesh" },
  { icon: Phone, label: "Phone", value: "+880 1XXX-XXXXXX", href: "tel:+8801XXXXXXXXX" },
  { icon: MessageCircle, label: "WhatsApp", value: "+880 1XXX-XXXXXX", href: "https://wa.me/8801XXXXXXXXX" },
  { icon: Mail, label: "Email", value: "admissions@example.com", href: "mailto:admissions@example.com" },
  { icon: Clock, label: "Working Hours", value: "Sat–Thu: 10:00 AM – 7:00 PM" },
];

const ContactSection = () => (
  <section className="py-16 px-4 bg-secondary" id="contact">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4 text-secondary-foreground">Contact Us</h2>
        <p className="text-secondary-foreground/80 text-lg">Visit our office or reach out — we're here to help.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {contacts.map((c) => (
          <div key={c.label} className="flex gap-4 items-start bg-secondary-foreground/5 border border-secondary-foreground/15 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <c.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-secondary-foreground/60 mb-1">{c.label}</p>
              {c.href ? (
                <a href={c.href} className="text-secondary-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">{c.value}</a>
              ) : (
                <p className="text-secondary-foreground">{c.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ContactSection;
```

- [ ] **Step 3: FooterSection — navy band, muted cream text**

Replace the full body of `components/landing/FooterSection.tsx` with:

```tsx
import Link from "next/link";

const FooterSection = () => (
  <footer className="pt-10 pb-12 px-4 bg-secondary">
    <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 text-center border-t border-secondary-foreground/15 pt-10">
      <div className="flex gap-6">
        <Link href="/privacy" className="text-xs text-secondary-foreground/70 hover:text-primary transition-colors uppercase tracking-wider">Privacy Notice</Link>
        <Link href="/terms" className="text-xs text-secondary-foreground/70 hover:text-primary transition-colors uppercase tracking-wider">Terms</Link>
      </div>
      <p className="text-xs text-secondary-foreground/70 tracking-wider">
        © {new Date().getFullYear()} ChinaAdmit · All rights reserved
      </p>
      <p className="text-[10px] text-secondary-foreground/40 max-w-2xl">
        Disclaimer: This agency facilitates admissions support and is not directly affiliated with any specific Chinese university. Statistics shown are based on reported data and internal records.
      </p>
    </div>
  </footer>
);

export default FooterSection;
```

- [ ] **Step 4: Verify in the browser**

Reload, scroll to the bottom of the page. Confirm CTA, Contact, and Footer form one continuous navy band (no white gap between them), gold CTA button, translucent white contact cards with gold icon badges, readable cream footer text and links that turn gold on hover.

- [ ] **Step 5: Commit**

```bash
git add components/landing/CTASection.tsx components/landing/ContactSection.tsx components/landing/FooterSection.tsx
git commit -m "Unify CTA, Contact, and Footer into closing navy band"
```

---

### Task 9: Full-page QA pass

**Files:** none (verification only; fix-forward if issues are found)

**Interfaces:** none.

- [ ] **Step 1: Full scroll-through on desktop width**

With the dev server running on port 8091, reload `http://localhost:8091`, and read the full page (`get_page_text` + a series of screenshots scrolling down) to confirm every section from Task 1–8 renders as designed: white/cream page, navy hero, gold-accent cards through Benefits/Programs/Process/Testimonials/FAQ, navy form panel + white form panel, navy closing band (CTA/Contact/Footer).

- [ ] **Step 2: Check console and network**

Run `read_console_messages` (onlyErrors: true) and `read_network_requests` — confirm zero errors and all assets/fonts return 200.

- [ ] **Step 3: Responsive check**

Resize to mobile width (375px) and re-screenshot the hero, a card grid section, and the closing band. Confirm no horizontal overflow and text remains legible against the navy sections at small width.

- [ ] **Step 4: Interaction check**

Click through the FAQ accordion (confirm open/close + gold chevron), fill Step 1 of the application form with valid data and click "Next" (confirm it advances to Step 2 with the new styling), verify the mobile nav / anchor links (`#benefits`, `#programs`, etc.) still scroll to the right section.

- [ ] **Step 5: Fix-forward and final commit**

If any visual issue turns up (e.g. a contrast problem, an unstyled element), fix it in the relevant component from Tasks 1–8 and commit that fix separately with a message describing what was wrong (e.g. `git commit -m "Fix low-contrast footer link on navy background"`). If nothing is found, no commit is needed for this task.
