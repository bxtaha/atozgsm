# ChinaAdmit Landing Page Redesign — Design

## Context

The current landing page (`app/page.tsx` and its section components) uses a dark
"tech console" theme: near-black background, neon mint/pink glows, `Space
Grotesk` throughout. It reads like a SaaS product demo rather than an
education-consultancy site aimed at Bangladeshi students (and their parents)
applying to universities in China. This redesign replaces the visual system
with a bright, trustworthy, premium look while keeping content, structure,
and functionality unchanged.

## Goals

- Replace the dark neon theme with a **Deep Navy & Gold** palette that reads
  as credible and premium.
- Keep the page **mostly white/cream**, using navy full-bleed bands only for
  the hero and the final CTA section (bookending the page).
- Apply a consistent **gold-top-accent card** treatment across benefit,
  program, and testimonial cards.
- Preserve all existing sections, copy, routes, and form behavior — this is a
  visual/styling pass, not a content or structural rewrite.

## Non-goals

- No new sections, no removed sections, no copy changes.
- No changes to form validation logic, submission handling, or routing.
- No backend/API changes.

## Design tokens

Replace the current CSS custom properties in `app/globals.css` (the
`--background`, `--primary`, `--secondary`, `--glow-mint`, `--glow-pink`,
etc. block) with a navy/gold/cream system:

| Token | Value | Notes |
|---|---|---|
| `--background` | cream `#faf6ee` (site base) | replaces near-black |
| `--foreground` | ink `#101828` | replaces white-on-black |
| `--primary` | navy `#0b1f3a` (gradient to `#14315c` where used as a fill) | replaces mint |
| `--primary-foreground` | cream `#faf6ee` | text on navy |
| `--secondary` / accent | gold `#d4af37` | replaces pink; CTAs, eyebrows, stat numbers, card top-line |
| `--card` | white `#ffffff` | |
| `--muted-foreground` | `#667085` | secondary text |
| `--radius` | keep `1rem` (10–14px effective on components) | |
| shadow | soft navy-tinted, e.g. `0 8px 24px rgba(11,31,58,0.08)` | replaces `glow-mint`/`glow-pink` box-shadow utilities |

Typography: keep the existing `font-display` CSS variable mechanism, but
swap the font. Headlines move to a serif (e.g. `Georgia`/a Google Fonts serif
such as `Fraunces` is explicitly out since it's on the overused list — use a
distinctive alternative, e.g. `Source Serif 4` or `Lora`) for an editorial
feel; body copy stays a clean sans-serif but **not** `Space Grotesk`/`Inter`/
`Geist` (all flagged as overused/generic) — use something with more
character, e.g. `Public Sans` or `Work Sans`. Final font pick happens during
implementation with a quick visual check, constrained to: serif display +
distinct sans body, both loaded via `next/font/google` like the current
Space Grotesk setup.

`.glow-mint` / `.glow-pink` utility classes and `--console-*` tokens are
removed since the console aesthetic goes away entirely; the `console-input`
component classes get renamed/restyled but keep the same structural
behavior (focus states, etc.) — only the colors/shadows change (navy/gold
focus ring instead of mint/pink glow).

## Section-by-section treatment

- **Nav**: white/cream sticky bar (was dark), navy wordmark, navy link text,
  gold-filled pill "Apply Now" button.
- **Hero**: full navy gradient band (keep existing photo overlay, darkened
  for contrast), cream/white headline text — structurally unchanged, only
  the underlying colors shift from dark-neon to navy — plus gold eyebrow
  label, gold stat numbers, gold CTA pill, and a navy-outline ghost
  secondary CTA.
- **Stats strip**: same floating strip at hero bottom, restyled as
  gold-tinted bordered cards instead of plain text-on-dark.
- **Benefits / Programs grids**: white background, cards get a 3px gold
  top border + soft navy-tinted shadow, navy icon badges, serif card
  titles.
- **Process (5 steps)**: white background; step numbers in solid gold
  circles connected by a thin navy connector line (vertical stack on
  mobile, horizontal on desktop breakpoint).
- **Stories (testimonials)**: cream band (breaks up the white sections),
  gold quotation mark accent, soft-shadow white cards.
- **Application form**: white card, swap mint/pink focus glow for a navy
  border + soft gold-tinted focus shadow; step indicator (1 CONTACT / 2
  EDUCATION) restyled in gold/navy instead of current console-key styling.
- **FAQ accordion**: white background, navy header text, gold chevron
  icon.
- **Final CTA + Contact/Footer**: navy band again (mirrors hero, bookends
  the page), gold CTA button, footer text in muted cream/gray on navy.

## Testing / verification

- No new logic, so no new unit tests needed beyond what `vitest` already
  covers for the form.
- Verification is visual: run the dev server, view each section, confirm no
  console errors, confirm responsive layout (mobile/desktop) still works,
  confirm form focus/validation states are visible against the new palette
  (contrast check), confirm accordion/nav interactions still function.

## Files expected to change

- `app/globals.css` (token replacement, remove console-specific utilities)
- `tailwind.config.ts` (color token wiring, remove `console-*`/`glow-*`
  entries no longer used, font family)
- Section components under `components/` (whatever currently renders hero,
  benefits, programs, process, stories, form, FAQ, contact/footer — styling
  classes only, no structural/logic changes)
- Possibly `app/layout.tsx` if the font loading changes
