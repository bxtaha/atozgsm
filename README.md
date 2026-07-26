# genz-spark-apply (Next.js)

The original Vite + React + shadcn/ui landing page, ported to **Next.js 14 (App Router)**.
All features, copy, styling and animations are unchanged — only the framework plumbing moved.

## Getting started

```bash
npm install
npm run dev      # http://localhost:8080
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # next lint
npm run test     # vitest
```

## Structure

```
app/
  layout.tsx          root layout — <html>/<body>, fonts, metadata (was index.html)
  providers.tsx       QueryClient / Tooltip / Toaster wrappers (was App.tsx)
  globals.css         design tokens + component classes (was src/index.css)
  page.tsx            "/"            → renders components/LandingPage
  thank-you/page.tsx  "/thank-you"
  privacy/page.tsx    "/privacy"
  terms/page.tsx      "/terms"
  not-found.tsx       404 (was the "*" route)
components/
  LandingPage.tsx     the landing page shell
  landing/*           page sections
  ui/*                shadcn/ui primitives
  NavLink.tsx         next/link-based replacement for react-router's NavLink
hooks/  lib/  assets/  public/  test/
```

There is deliberately **no `pages/` directory** — in the App Router that name is
reserved for the legacy Pages Router and would conflict.

## What changed in the migration

| Before (Vite) | After (Next.js) |
| --- | --- |
| `index.html` `<head>` | `metadata` / `viewport` exports in `app/layout.tsx` |
| `src/main.tsx` + `src/App.tsx` | `app/layout.tsx` + `app/providers.tsx` |
| `react-router-dom` routes | file-system routes under `app/` |
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `<Link to="…">` | `<Link href="…">` from `next/link` |
| `useLocation()` in the 404 | `usePathname()` in `app/not-found.tsx` |
| Google Fonts `@import` in CSS | `next/font/google` → `--font-space-grotesk` |
| `src/*` with `@/*` alias | project root with `@/*` alias |
| `vite.config.ts` | `next.config.mjs` |
| `dist/` output | `.next/` output |

Interactive modules (`components/ui/*`, `hooks/*`, `ApplicationForm`, `LandingPage`)
carry the `"use client"` directive. The purely presentational sections stay server
components, so the marketing copy is server-rendered for SEO.

### Images

`assets/*.jpg` are still imported as modules. Next resolves them to a
`StaticImageData` object, so the `<img>` tags use `.src`:

```tsx
import heroBanner from "@/assets/hero-banner.jpg";
<img src={heroBanner.src} … />
```

Plain `<img>` was kept on purpose so the rendered markup and layout match the
original exactly. Swapping in `next/image` later would add automatic optimisation.

### Removed dependencies

`vite`, `@vitejs/plugin-react-swc`, `lovable-tagger`, `react-router-dom`.
Added: `next`, `eslint-config-next`.

## Deploying

The project builds to a standard Next.js output and runs on Vercel, Netlify,
Docker, or any Node host via `npm run build && npm run start`.

## Notes

- Pinned to Next 14 because the project uses React 18. To move to Next 15+,
  upgrade `react` and `react-dom` to 19 at the same time.
- `ApplicationForm` still simulates submission with a 1.5s timeout, exactly as
  before. When you wire up a real backend, `app/api/apply/route.ts` is the
  natural place for it.
