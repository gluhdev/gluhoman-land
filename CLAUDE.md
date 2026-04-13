# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing site for the "Глухомань" recreational complex in с. Нижні Млини, Полтавська область, Ukraine. Next.js 15 App Router + React 19 + TypeScript 5 + Tailwind v4 + shadcn/ui (Radix primitives), deployed on Vercel. Content language is **Ukrainian** throughout — do not introduce Russian or English copy into the UI.

Additional long-form docs live in `docs/ARCHITECTURE.md`, `docs/SETUP.md`, `docs/TECH_STACK.md`.

## Essential Commands

```bash
npm run dev                    # Next dev server with Turbopack (default port 3000)
npm run dev -- --port 3002     # Alternate port if 3000 is taken
npm run build                  # Production build (Turbopack)
npm run start                  # Run built app
npm run lint                   # ESLint (script is plain `eslint`, not `next lint`)
npx shadcn@latest add <name>   # Add a shadcn/ui component
```

There is **no test runner wired up**. `@playwright/test` is in devDependencies but there are no tests, no `playwright.config.*`, and no test script — treat Playwright as unused scaffolding until a config is added.

## Architecture

### App Router pages (`src/app/`)
Only these routes actually exist:
- `/` — main page (VideoHero + services overview)
- `/aquapark`, `/restaurant`, `/hotel`, `/sauna` — main service pages
- `src/app/other-services/` — **empty directory**. `ADDITIONAL_SERVICES` in `src/constants/index.ts` links to 8 `/other-services/*` URLs (apitherapy, wedding, paintball, horses, kids-parties, bbq-zone, brewery-tour, petting-zoo) that currently 404. When touching navigation or that constant, be aware these links are broken.

### Components (`src/components/`)
- `layout/` — `Header`, `Footer`
- `sections/` — page sections: `VideoHero`, `HeroSection`, `ServicesGrid`, `ServicesSlider`, `BookingSection`, `LocationSection`, `SectionDivider`
- `ui/` — shadcn primitives (`button`, `card`, `navigation-menu`) plus project-specific widgets: `BookingForm`, `BookingReviews`, `GoogleReviews`, `InstagramFeed`, `FloatingButtons`, `ServiceButtons`, `Preloader`

### Data flow
All static content is centralized in `src/constants/index.ts`:
- `CONTACT_INFO` — phones, address, working hours
- `MAIN_SERVICES: ServiceCard[]` — the 4 headline services
- `ADDITIONAL_SERVICES: ServiceCard[]` — the 8 extras (rendered into the "Інші послуги" dropdown)
- `NAVIGATION` — derived from the above; adding an item to `ADDITIONAL_SERVICES` automatically adds it to the dropdown

Shared interfaces (`ServiceCard`, `ContactInfo`, `HeroSection`, `Service`) live in `src/types/index.ts`. A `ServiceCard` is `{ id, title, description, image, href, category: 'main' | 'additional' }`.

To add a new service: append to the right array in `src/constants/index.ts`, then create the matching `src/app/<slug>/page.tsx` (or `src/app/other-services/<slug>/page.tsx`).

### Images — important gotcha
There are **two image directories** with overlapping contents:
- `/public/images/` — served by Next.js at `/images/...`. This is the canonical one.
- `/images/` at repo root — **not served by Next.js**. It's a staging dump of source photos/video (`main.mp4`, `1.jpg`…`45.jpg`, etc.). Anything referenced from code must live under `/public/`.

Service entries in `src/constants/index.ts` currently point at `/placeholder-*.jpg` paths that do not exist on disk — real photos still need to be wired up.

## Build & deployment notes

`next.config.ts` sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`. This exists so Vercel deploys don't break on type/lint errors — **not** as license to skip quality checks. Run `npm run lint` and `tsc --noEmit` manually before committing non-trivial changes.

Turbopack is enabled for both `dev` and `build`.

## Known broken / stale state (as of this writing)

- 8 dropdown nav items under "Інші послуги" link to missing `/other-services/*` pages.
- `MAIN_SERVICES` and `ADDITIONAL_SERVICES` reference placeholder image paths that 404.
- Root-level `/images/` duplicates files with `/public/images/` and should be consolidated.

When fixing any of these, check whether the other two are affected by the same change.
