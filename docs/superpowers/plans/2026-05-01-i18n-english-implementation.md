# i18n English Localization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fully-translated English version of the Глухомань marketing site at `/en/...` alongside the default Ukrainian site, with browser-language auto-detect, a flag-based switcher, and DeepL-driven translation maintenance that prevents EN drift as content evolves.

**Architecture:** `next-intl` middleware-based locale detection on the `[locale]` route segment. UA stays prefix-free (`/sauna`); EN uses `/en/` prefix. All user-visible strings live in `messages/uk.json` (source of truth) and `messages/en.json` (DeepL-synced). A pre-commit hook + CI check + ESLint rule ensure EN never drifts behind UA.

**Tech Stack:** Next.js 15.5 App Router, React 19, TypeScript 5, `next-intl` 3.x, DeepL API (Free tier), `husky` for git hooks, GitHub Actions for CI.

**Reference Spec:** `docs/superpowers/specs/2026-05-01-i18n-english-design.md`

**Scope adjustment from spec:** The spec listed 5 main pages. Actual public surface area is **30+ pages**: home, sauna (+ booking/success/fail), restaurant, hotel (+ booking/success/fail), aquapark (+ buy/success/fail), menu (+ checkout/success/fail), gallery, privacy, terms, and `/other-services/[slug]` with 8 sub-pages (apitherapy, bbq-zone, brewery-tour, horses, kids-parties, paintball, petting-zoo, wedding). Plus 16 UI components and 18 section components. **Out of scope:** `/admin/*` (owner-facing, stays UA-only), `/api/*` (no UI text).

---

## File Structure

**New files:**
- `src/middleware.ts` — `next-intl` locale detection
- `src/i18n/routing.ts` — locale config
- `src/i18n/request.ts` — message loader for server components
- `src/components/ui/LanguageSwitcher.tsx` — flag toggle
- `messages/uk.json` — Ukrainian source of truth
- `messages/en.json` — English (synced via DeepL)
- `messages/.hashes.json` — per-key source-hash snapshot (drift detection)
- `scripts/i18n/sync.ts` — DeepL sync entrypoint
- `scripts/i18n/check.ts` — read-only drift check
- `scripts/i18n/glossary.ts` — brand-term overrides
- `.husky/pre-commit` — blocks UA edits without EN sync
- `.github/workflows/i18n-check.yml` — CI drift check
- `eslint-rules/no-cyrillic-jsx.js` — local ESLint rule

**Files to move:**
- `src/app/page.tsx` → `src/app/[locale]/page.tsx`
- `src/app/{sauna,restaurant,hotel,aquapark,menu,gallery,privacy,terms,other-services}/**` → `src/app/[locale]/{...}`
- `src/app/layout.tsx` → split: thin root layout stays at `src/app/layout.tsx`, full layout moves to `src/app/[locale]/layout.tsx`
- `src/app/sitemap.ts` — extended for multi-locale
- `src/app/robots.ts` — verify still applies (no change expected)

**Files to NOT move (stay outside `[locale]`):**
- `src/app/api/**` — backend, no UI text
- `src/app/admin/**` — owner-facing, UA-only
- `src/app/actions/**` — server actions, called from any locale

**Files to modify (string extraction):**
All files under `src/components/`, `src/constants/index.ts`, `src/data/menu.json`, every `page.tsx` in scope. Replace hardcoded UA strings with `useTranslations()` (client) or `getTranslations()` (server) calls.

---

## Phase 1 — Foundation: install `next-intl` and route restructure

### Task 1: Install `next-intl`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install dependency**

```bash
npm install next-intl@^3.26.0
```

Expected: package.json adds `"next-intl": "^3.26.0"` to dependencies; package-lock.json updates.

- [ ] **Step 2: Verify install**

```bash
npm ls next-intl
```

Expected output: `next-intl@3.26.x` (or higher 3.x).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(i18n): install next-intl"
```

---

### Task 2: Create i18n routing config

**Files:**
- Create: `src/i18n/routing.ts`

- [ ] **Step 1: Write routing config**

`src/i18n/routing.ts`:

```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['uk', 'en'],
  defaultLocale: 'uk',
  localePrefix: 'as-needed',
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 2: Commit**

```bash
git add src/i18n/routing.ts
git commit -m "feat(i18n): add next-intl routing config (uk default, en prefixed)"
```

---

### Task 3: Create i18n request config (message loader)

**Files:**
- Create: `src/i18n/request.ts`
- Create: `messages/uk.json` (empty stub)
- Create: `messages/en.json` (empty stub)

- [ ] **Step 1: Create empty message files**

`messages/uk.json`:
```json
{}
```

`messages/en.json`:
```json
{}
```

- [ ] **Step 2: Write request config**

`src/i18n/request.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/request.ts messages/uk.json messages/en.json
git commit -m "feat(i18n): add request config + empty message files"
```

---

### Task 4: Create middleware for locale detection

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Write middleware**

`src/middleware.ts`:

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all paths EXCEPT api, admin, _next, static files, and files with extensions
  matcher: [
    '/((?!api|admin|_next|_vercel|.*\\..*).*)',
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(i18n): add locale detection middleware (skips /api and /admin)"
```

---

### Task 5: Configure `next.config.ts` for next-intl plugin

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Read current config**

```bash
cat next.config.ts
```

Note the existing config object.

- [ ] **Step 2: Wrap config with `createNextIntlPlugin`**

Top of `next.config.ts`:

```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
```

At the bottom, change `export default nextConfig;` to:

```typescript
export default withNextIntl(nextConfig);
```

- [ ] **Step 3: Verify build doesn't error on config load**

```bash
npx next build --no-lint 2>&1 | head -30
```

Expected: build starts; should not error on config import. If build fails for other reasons (missing translation keys, broken pages), that's OK at this stage — we just need config to load.

If config-load fails, fix imports before proceeding.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat(i18n): wrap next config with next-intl plugin"
```

---

### Task 6: Move all public pages into `[locale]` segment

**Files:**
- Move: `src/app/page.tsx` → `src/app/[locale]/page.tsx`
- Move: `src/app/sauna/` → `src/app/[locale]/sauna/`
- Move: `src/app/restaurant/` → `src/app/[locale]/restaurant/`
- Move: `src/app/hotel/` → `src/app/[locale]/hotel/`
- Move: `src/app/aquapark/` → `src/app/[locale]/aquapark/`
- Move: `src/app/menu/` → `src/app/[locale]/menu/`
- Move: `src/app/gallery/` → `src/app/[locale]/gallery/`
- Move: `src/app/privacy/` → `src/app/[locale]/privacy/`
- Move: `src/app/terms/` → `src/app/[locale]/terms/`
- Move: `src/app/other-services/` → `src/app/[locale]/other-services/`
- Move: `src/app/not-found.tsx` → `src/app/[locale]/not-found.tsx`
- Move: `src/app/error.tsx` → `src/app/[locale]/error.tsx`
- Move: `src/app/loading.tsx` → `src/app/[locale]/loading.tsx`
- Move: `src/app/layout.tsx` → `src/app/[locale]/layout.tsx` (will refactor in Task 7)

**Stays at top level:** `src/app/api/`, `src/app/admin/`, `src/app/actions/`, `src/app/global-error.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/favicon.ico`, `src/app/globals.css`, `src/app/mobile.css`.

- [ ] **Step 1: Create `[locale]` directory and move pages**

```bash
mkdir -p src/app/\[locale\]
git mv src/app/page.tsx src/app/\[locale\]/page.tsx
git mv src/app/sauna src/app/\[locale\]/sauna
git mv src/app/restaurant src/app/\[locale\]/restaurant
git mv src/app/hotel src/app/\[locale\]/hotel
git mv src/app/aquapark src/app/\[locale\]/aquapark
git mv src/app/menu src/app/\[locale\]/menu
git mv src/app/gallery src/app/\[locale\]/gallery
git mv src/app/privacy src/app/\[locale\]/privacy
git mv src/app/terms src/app/\[locale\]/terms
git mv src/app/other-services src/app/\[locale\]/other-services
git mv src/app/not-found.tsx src/app/\[locale\]/not-found.tsx
git mv src/app/error.tsx src/app/\[locale\]/error.tsx
git mv src/app/loading.tsx src/app/\[locale\]/loading.tsx
git mv src/app/layout.tsx src/app/\[locale\]/layout.tsx
```

- [ ] **Step 2: Verify directory structure**

```bash
ls src/app/
```

Expected: `[locale]/`, `actions/`, `admin/`, `api/`, `favicon.ico`, `global-error.tsx`, `globals.css`, `mobile.css`, `robots.ts`, `sitemap.ts`.

- [ ] **Step 3: Commit (move only, no content changes yet)**

```bash
git commit -m "refactor(i18n): move public pages into [locale] route segment"
```

---

### Task 7: Create thin root layout + adapt `[locale]/layout.tsx`

**Files:**
- Create: `src/app/layout.tsx` (new thin root)
- Modify: `src/app/[locale]/layout.tsx` (now receives `params.locale`, wraps with `NextIntlClientProvider`)

- [ ] **Step 1: Create thin root layout**

`src/app/layout.tsx`:

```typescript
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
```

This is intentionally minimal — `<html>` and `<body>` move into `[locale]/layout.tsx` so they can use the active locale for `<html lang>`.

- [ ] **Step 2: Read current `[locale]/layout.tsx`**

```bash
cat src/app/\[locale\]/layout.tsx
```

Note the existing `<html>`, `<body>`, providers, fonts.

- [ ] **Step 3: Update `[locale]/layout.tsx` signature and provider**

At the top of `src/app/[locale]/layout.tsx`:

```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
```

Change the layout function signature to accept `params`:

```typescript
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={/* keep existing className */}>
      <body className={/* keep existing className */}>
        <NextIntlClientProvider messages={messages}>
          {/* keep existing children/providers structure */}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

Preserve existing font imports, body classes, theme providers, analytics scripts, etc. — only add the locale handling and `NextIntlClientProvider`.

- [ ] **Step 4: Add `generateStaticParams` to `[locale]/layout.tsx`**

Below the layout function:

```typescript
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

- [ ] **Step 5: Run dev server and verify both routes load**

```bash
npm run dev
```

In another terminal:
```bash
curl -sI http://localhost:3000/ | head -3
curl -sI http://localhost:3000/en | head -3
```

Expected: both return `HTTP/1.1 200 OK` (or 304 if cached). If `/en` returns 404, the `[locale]` segment isn't catching it — fix routing before proceeding.

- [ ] **Step 6: Verify `<html lang>` is correct in each locale**

```bash
curl -s http://localhost:3000/ | grep -o '<html[^>]*>' | head -1
curl -s http://localhost:3000/en | grep -o '<html[^>]*>' | head -1
```

Expected: first shows `lang="uk"`, second shows `lang="en"`.

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/app/\[locale\]/layout.tsx
git commit -m "feat(i18n): split root layout, wrap [locale] in NextIntlClientProvider"
```

---

## Phase 2 — Translation tooling (DeepL sync, glossary, drift checks)

### Task 8: Add DeepL placeholder to `.env.example`

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Append DeepL placeholder**

Add to `.env.example`:

```
# DeepL Free API key (used by `npm run i18n:sync` only — not at runtime).
# Get from https://www.deepl.com/your-account/keys (Free plan: 500k chars/month).
# Format ends with `:fx` for Free tier, no suffix for Pro.
DEEPL_API_KEY=your-key-here:fx
```

- [ ] **Step 2: Confirm `.env.local` already has the real key (set during brainstorming)**

```bash
grep -c "^DEEPL_API_KEY=" .env.local
```

Expected: `1`. If `0`, add it: `echo 'DEEPL_API_KEY=<key from user>' >> .env.local`.

- [ ] **Step 3: Confirm `.env.local` is gitignored**

```bash
git check-ignore .env.local
```

Expected: prints `.env.local`.

- [ ] **Step 4: Commit**

```bash
git add .env.example
git commit -m "chore(i18n): document DEEPL_API_KEY in .env.example"
```

---

### Task 9: Install DeepL SDK and tsx for scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install dependencies**

```bash
npm install --save-dev deepl-node
```

Note: `tsx` is already in devDependencies (used by `db:seed`); reuse it.

Verify:
```bash
npm ls deepl-node tsx
```

Expected: both present.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(i18n): install deepl-node SDK"
```

---

### Task 10: Create glossary module

**Files:**
- Create: `scripts/i18n/glossary.ts`

- [ ] **Step 1: Write glossary**

`scripts/i18n/glossary.ts`:

```typescript
/**
 * Brand-term overrides applied before/after DeepL translation.
 * - `pre`: replace UA term with a placeholder before sending to DeepL.
 * - `post`: replace placeholder with the desired EN form in DeepL output.
 *
 * This protects brand names, sauna program names, and place names
 * from being machine-translated as common nouns.
 */

export interface GlossaryEntry {
  uk: string;
  en: string;
}

export const GLOSSARY: GlossaryEntry[] = [
  { uk: 'Глухомань', en: 'Glukhoman' },
  { uk: "Здоров'я", en: 'Zdorovya' },
  { uk: 'Класична', en: 'Klasychna' },
  { uk: 'Нижні Млини', en: 'Nyzhni Mlyny' },
  { uk: 'Полтавська область', en: 'Poltava region' },
  { uk: 'грн/год', en: 'UAH/hour' },
  { uk: 'грн', en: 'UAH' },
];

const PLACEHOLDER = (i: number) => `__GLOSSARY_${i}__`;

export function applyPreGlossary(input: string): {
  output: string;
  used: number[];
} {
  let output = input;
  const used: number[] = [];
  GLOSSARY.forEach((entry, i) => {
    if (output.includes(entry.uk)) {
      output = output.split(entry.uk).join(PLACEHOLDER(i));
      used.push(i);
    }
  });
  return { output, used };
}

export function applyPostGlossary(input: string, used: number[]): string {
  let output = input;
  used.forEach((i) => {
    output = output.split(PLACEHOLDER(i)).join(GLOSSARY[i].en);
  });
  return output;
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/i18n/glossary.ts
git commit -m "feat(i18n): add brand-term glossary for DeepL sync"
```

---

### Task 11: Create DeepL sync script

**Files:**
- Create: `scripts/i18n/sync.ts`

- [ ] **Step 1: Write sync script**

`scripts/i18n/sync.ts`:

```typescript
import { Translator } from 'deepl-node';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { applyPreGlossary, applyPostGlossary } from './glossary';

const ROOT = resolve(__dirname, '../..');
const UK_PATH = resolve(ROOT, 'messages/uk.json');
const EN_PATH = resolve(ROOT, 'messages/en.json');
const HASHES_PATH = resolve(ROOT, 'messages/.hashes.json');

const apiKey = process.env.DEEPL_API_KEY;
if (!apiKey) {
  console.error('DEEPL_API_KEY not set. Add it to .env.local.');
  process.exit(1);
}

const translator = new Translator(apiKey);

type Json = Record<string, unknown>;

function sha1(s: string): string {
  return createHash('sha1').update(s).digest('hex');
}

function flatten(obj: Json, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') out[key] = v;
    else if (v && typeof v === 'object') Object.assign(out, flatten(v as Json, key));
  }
  return out;
}

function setNested(obj: Json, path: string, value: string): void {
  const parts = path.split('.');
  let cur: Json = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== 'object' || cur[parts[i]] === null) cur[parts[i]] = {};
    cur = cur[parts[i]] as Json;
  }
  cur[parts[parts.length - 1]] = value;
}

async function translate(uk: string): Promise<string> {
  const { output, used } = applyPreGlossary(uk);
  const result = await translator.translateText(output, 'uk', 'en-US', {
    preserveFormatting: true,
  });
  return applyPostGlossary(result.text, used);
}

async function main() {
  if (!existsSync(UK_PATH)) {
    console.error(`Source missing: ${UK_PATH}`);
    process.exit(1);
  }
  const uk = JSON.parse(readFileSync(UK_PATH, 'utf-8')) as Json;
  const en = existsSync(EN_PATH) ? (JSON.parse(readFileSync(EN_PATH, 'utf-8')) as Json) : {};
  const hashes = existsSync(HASHES_PATH)
    ? (JSON.parse(readFileSync(HASHES_PATH, 'utf-8')) as Record<string, string>)
    : {};

  const flat = flatten(uk);
  const flatEn = flatten(en);
  const newHashes: Record<string, string> = {};

  let translated = 0;
  let unchanged = 0;
  let errors = 0;

  for (const [key, ukValue] of Object.entries(flat)) {
    const hash = sha1(ukValue);
    newHashes[key] = hash;

    const isNew = !(key in flatEn);
    const sourceChanged = hashes[key] !== hash;

    if (!isNew && !sourceChanged) {
      unchanged++;
      continue;
    }

    try {
      console.log(`→ ${key}`);
      const enValue = await translate(ukValue);
      setNested(en, key, enValue);
      translated++;
    } catch (err) {
      console.error(`  ✗ ${key}: ${(err as Error).message}`);
      errors++;
    }
  }

  writeFileSync(EN_PATH, JSON.stringify(en, null, 2) + '\n');
  writeFileSync(HASHES_PATH, JSON.stringify(newHashes, null, 2) + '\n');

  console.log(`\nTranslated: ${translated}, unchanged: ${unchanged}, errors: ${errors}`);
  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Add npm script**

In `package.json` `"scripts"` block, add:

```json
"i18n:sync": "tsx --env-file=.env.local scripts/i18n/sync.ts",
```

- [ ] **Step 3: Test with empty messages (smoke test)**

```bash
npm run i18n:sync
```

Expected: prints `Translated: 0, unchanged: 0, errors: 0` (since `uk.json` is `{}`).

- [ ] **Step 4: Commit**

```bash
git add scripts/i18n/sync.ts package.json package-lock.json messages/.hashes.json
git commit -m "feat(i18n): add DeepL sync script (npm run i18n:sync)"
```

---

### Task 12: Create i18n drift check script

**Files:**
- Create: `scripts/i18n/check.ts`

- [ ] **Step 1: Write check script**

`scripts/i18n/check.ts`:

```typescript
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(__dirname, '../..');
const UK_PATH = resolve(ROOT, 'messages/uk.json');
const EN_PATH = resolve(ROOT, 'messages/en.json');
const HASHES_PATH = resolve(ROOT, 'messages/.hashes.json');

type Json = Record<string, unknown>;

function sha1(s: string): string {
  return createHash('sha1').update(s).digest('hex');
}

function flatten(obj: Json, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') out[key] = v;
    else if (v && typeof v === 'object') Object.assign(out, flatten(v as Json, key));
  }
  return out;
}

const uk = JSON.parse(readFileSync(UK_PATH, 'utf-8')) as Json;
const en = existsSync(EN_PATH) ? (JSON.parse(readFileSync(EN_PATH, 'utf-8')) as Json) : {};
const hashes = existsSync(HASHES_PATH)
  ? (JSON.parse(readFileSync(HASHES_PATH, 'utf-8')) as Record<string, string>)
  : {};

const flatUk = flatten(uk);
const flatEn = flatten(en);

const missing: string[] = [];
const stale: string[] = [];

for (const [key, value] of Object.entries(flatUk)) {
  if (!(key in flatEn)) missing.push(key);
  else if (hashes[key] !== sha1(value)) stale.push(key);
}

const orphaned = Object.keys(flatEn).filter((k) => !(k in flatUk));

if (missing.length === 0 && stale.length === 0 && orphaned.length === 0) {
  console.log('✓ Translations in sync.');
  process.exit(0);
}

if (missing.length) {
  console.error(`Missing in en.json (${missing.length}):`);
  missing.forEach((k) => console.error(`  - ${k}`));
}
if (stale.length) {
  console.error(`Stale (UA changed since last sync) (${stale.length}):`);
  stale.forEach((k) => console.error(`  - ${k}`));
}
if (orphaned.length) {
  console.error(`Orphaned in en.json (no UA source) (${orphaned.length}):`);
  orphaned.forEach((k) => console.error(`  - ${k}`));
}
console.error('\nRun `npm run i18n:sync` to fix.');
process.exit(1);
```

- [ ] **Step 2: Add npm script**

In `package.json`:

```json
"i18n:check": "tsx scripts/i18n/check.ts",
```

- [ ] **Step 3: Test (should pass on empty state)**

```bash
npm run i18n:check
```

Expected: `✓ Translations in sync.` and exit 0.

- [ ] **Step 4: Commit**

```bash
git add scripts/i18n/check.ts package.json
git commit -m "feat(i18n): add drift check script (npm run i18n:check)"
```

---

### Task 13: Set up husky pre-commit hook

**Files:**
- Modify: `package.json`
- Create: `.husky/pre-commit`

- [ ] **Step 1: Install husky**

```bash
npm install --save-dev husky
npx husky init
```

This creates `.husky/pre-commit` with a default `npm test` line.

- [ ] **Step 2: Replace `.husky/pre-commit` content**

`.husky/pre-commit`:

```sh
#!/usr/bin/env sh

# Block commits that change messages/uk.json without also updating
# messages/en.json. Forces engineers to run `npm run i18n:sync` before
# committing UA content changes.

UK_CHANGED=$(git diff --cached --name-only | grep -c '^messages/uk\.json$' || true)
EN_CHANGED=$(git diff --cached --name-only | grep -c '^messages/en\.json$' || true)

if [ "$UK_CHANGED" -gt 0 ] && [ "$EN_CHANGED" -eq 0 ]; then
  echo "✗ messages/uk.json changed but messages/en.json was not."
  echo "  Run \`npm run i18n:sync\` and stage the result before committing."
  exit 1
fi

# Also fail if check script reports drift (catches forgotten syncs).
npm run --silent i18n:check
```

- [ ] **Step 3: Make hook executable**

```bash
chmod +x .husky/pre-commit
```

- [ ] **Step 4: Verify hook runs**

```bash
echo "x" >> messages/uk.json
git add messages/uk.json
git commit -m "test" 2>&1 | head -5
```

Expected: commit blocked with the error message. Then revert:

```bash
git restore --staged messages/uk.json
git checkout messages/uk.json
```

- [ ] **Step 5: Commit hook setup**

```bash
git add .husky/pre-commit package.json package-lock.json
git commit -m "feat(i18n): add husky pre-commit hook to enforce uk/en sync"
```

---

### Task 14: Add CI workflow for drift check

**Files:**
- Create: `.github/workflows/i18n-check.yml`

- [ ] **Step 1: Write workflow**

`.github/workflows/i18n-check.yml`:

```yaml
name: i18n drift check

on:
  pull_request:
    paths:
      - 'messages/**'
      - 'src/**/*.tsx'
      - 'src/**/*.ts'
  push:
    branches: [main]
    paths:
      - 'messages/**'

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run i18n:check
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/i18n-check.yml
git commit -m "ci(i18n): add PR check for translation drift"
```

---

## Phase 3 — Layout strings + language switcher

### Task 15: Build `LanguageSwitcher` component

**Files:**
- Create: `src/components/ui/LanguageSwitcher.tsx`

- [ ] **Step 1: Write component**

`src/components/ui/LanguageSwitcher.tsx`:

```tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

const FLAGS = {
  uk: (
    <svg viewBox="0 0 24 24" aria-hidden className="block h-full w-full">
      <circle cx="12" cy="12" r="12" fill="#005BBB" />
      <path d="M0 12 a12 12 0 0 0 24 0z" fill="#FFD500" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 24 24" aria-hidden className="block h-full w-full">
      <defs>
        <clipPath id="circleClip">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#circleClip)">
        <rect width="24" height="24" fill="#012169" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#fff" strokeWidth="3" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" strokeWidth="1.5" />
        <path d="M12 0V24M0 12H24" stroke="#fff" strokeWidth="4" />
        <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="2.4" />
      </g>
    </svg>
  ),
} as const;

const LABELS = { uk: 'Українська', en: 'English' } as const;

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as 'uk' | 'en';
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(target: 'uk' | 'en') {
    if (target === locale || isPending) return;
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.replace(pathname, { locale: target });
    });
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)} role="group" aria-label="Language">
      {(['uk', 'en'] as const).map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            aria-label={LABELS[code]}
            aria-pressed={active}
            className={cn(
              'relative h-7 w-7 overflow-hidden rounded-full transition-all duration-200',
              'sm:h-7 sm:w-7',
              active
                ? 'scale-105 shadow-[0_0_0_1.5px_var(--color-accent,#c8a661)]'
                : 'scale-100 opacity-50 grayscale hover:opacity-90 hover:grayscale-0',
              isPending && 'pointer-events-none',
            )}
          >
            {FLAGS[code]}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify import path for `cn`**

```bash
grep -l "export.*function cn" src/lib/
```

If `src/lib/utils.ts` exports `cn`, the import is correct. If `cn` lives elsewhere, adjust the import.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/LanguageSwitcher.tsx
git commit -m "feat(i18n): add LanguageSwitcher component (round flag toggle)"
```

---

### Task 16: Extract Header strings + wire LanguageSwitcher

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `messages/uk.json`

- [ ] **Step 1: Read current Header**

```bash
cat src/components/layout/Header.tsx
```

Identify every hardcoded Ukrainian string: nav labels (Головна, Сауна, Ресторан, Готель, Аквапарк, Інші послуги, sub-items in dropdown), phone number label, booking CTA text, mobile menu trigger label, "close menu" sr-only text, etc.

- [ ] **Step 2: Add keys to `messages/uk.json`**

```json
{
  "nav": {
    "home": "Головна",
    "sauna": "Сауна",
    "restaurant": "Ресторан",
    "hotel": "Готель",
    "aquapark": "Аквапарк",
    "menu": "Меню",
    "gallery": "Галерея",
    "other_services": "Інші послуги",
    "open_menu": "Відкрити меню",
    "close_menu": "Закрити меню"
  },
  "header": {
    "book_now": "Забронювати",
    "phone_label": "Телефон"
  }
}
```

(Adjust to match exact strings found in Header.tsx.)

- [ ] **Step 3: Replace hardcoded strings in `Header.tsx`**

If Header is a client component (uses hooks), add:

```typescript
'use client';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Link } from '@/i18n/routing';
```

Inside component:

```typescript
const tNav = useTranslations('nav');
const tHeader = useTranslations('header');
```

Replace each hardcoded string:
- `"Головна"` → `{tNav('home')}`
- `"Сауна"` → `{tNav('sauna')}`
- ... etc for every nav label.
- `"Забронювати"` → `{tHeader('book_now')}`

Replace `<a href="/sauna">` (and similar internal links) with `<Link href="/sauna">` from `@/i18n/routing` so `next-intl` rewrites paths per locale.

Add `<LanguageSwitcher className="ml-3" />` next to the phone number / booking CTA in the desktop top bar. In the mobile burger drawer, place it at the top of the menu.

If Header is a server component, use `getTranslations` and import `Link` from the same module — but the component will likely need to be split into a client wrapper for the burger menu state.

- [ ] **Step 4: Sync EN translations**

```bash
npm run i18n:sync
```

Expected: prints lines for each new key, finishes with `Translated: N, unchanged: 0, errors: 0`. The script writes both `messages/en.json` and `messages/.hashes.json`.

- [ ] **Step 5: Visual verification**

```bash
npm run dev
```

Open `http://localhost:3000/` — verify nav labels are Ukrainian; click EN flag — verify URL becomes `/en` and labels become English. Click UA flag — verify return to Ukrainian.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/Header.tsx messages/uk.json messages/en.json messages/.hashes.json
git commit -m "feat(i18n): extract Header strings + wire LanguageSwitcher"
```

---

### Task 17: Extract Footer strings

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Modify: `messages/uk.json`

- [ ] **Step 1: Read Footer**

```bash
cat src/components/layout/Footer.tsx
```

Identify all hardcoded UA strings: column titles (e.g. "Послуги", "Контакти", "Робочий час"), each link label, address line, working-hours line, copyright, social-link labels (sr-only).

- [ ] **Step 2: Add keys to `messages/uk.json` under `footer.*`**

Example:

```json
"footer": {
  "services_heading": "Послуги",
  "contacts_heading": "Контакти",
  "hours_heading": "Робочий час",
  "address_line": "с. Нижні Млини, Полтавська область",
  "hours_line": "Щодня 10:00 — 22:00",
  "copyright": "© {year} Глухомань. Усі права захищені.",
  "social": {
    "instagram_aria": "Instagram",
    "facebook_aria": "Facebook"
  }
}
```

(Adjust to match the actual file.)

- [ ] **Step 3: Replace hardcoded strings**

Add `useTranslations` import. Replace each string with `t(...)`. For year interpolation, use the ICU syntax: `t('copyright', { year: new Date().getFullYear() })`.

- [ ] **Step 4: Sync, verify, commit**

```bash
npm run i18n:sync
npm run dev   # smoke check both locales
git add src/components/layout/Footer.tsx messages/uk.json messages/en.json messages/.hashes.json
git commit -m "feat(i18n): extract Footer strings"
```

---

## Phase 4 — Page extraction (sections + pages)

> **Pattern (applies to every task in this phase):**
> 1. Read the file, list every Cyrillic string.
> 2. Add nested keys to `messages/uk.json` under a namespace matching the file (e.g. `home.hero.*`, `sauna.programs.*`).
> 3. Add `useTranslations()` (client component) or `getTranslations()` (server component) — use the same `routing.ts` `Link` for internal links.
> 4. Replace each hardcoded string with `t('key')`.
> 5. Run `npm run i18n:sync` to refresh `en.json`.
> 6. Run dev server, verify both locales render.
> 7. Commit with message `feat(i18n): extract <component-name> strings`.

### Task 18: Extract Home page sections (`HomeHero`, `HomeFeatures`, `HomeStory`, `HomeServices`, `HomeReviews`, `HomeGallery`, `HomeLocation`, `HomeBookingCta`)

**Files:**
- Modify: `src/components/sections/HomeHero.tsx`, `HomeFeatures.tsx`, `HomeStory.tsx`, `HomeServices.tsx`, `HomeReviews.tsx`, `HomeGallery.tsx`, `HomeLocation.tsx`, `HomeBookingCta.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `messages/uk.json`

- [ ] **Step 1: Run extraction pattern for each file**

For each `Home*.tsx` file, follow the extraction pattern. Use the `home.*` namespace, with sub-keys matching the section: `home.hero.title`, `home.features.heading`, `home.story.body`, etc.

- [ ] **Step 2: Sync and verify**

```bash
npm run i18n:sync
npm run dev
```

Open `/` and `/en` — every section should render translated.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Home*.tsx src/app/\[locale\]/page.tsx messages/uk.json messages/en.json messages/.hashes.json
git commit -m "feat(i18n): extract home page sections"
```

---

### Task 19: Extract `/sauna` page + `SaunaFromClientFull`

**Files:**
- Modify: `src/components/sections/SaunaFromClientFull.tsx`
- Modify: `src/app/[locale]/sauna/page.tsx`
- Modify: `messages/uk.json` (under `sauna.*`)

Sauna page is the heaviest — contains program names, descriptions, prices, technical paragraphs, and multiple CTA blocks. Use this key structure:

```json
"sauna": {
  "page_title": "...",
  "hero": { "title": "...", "subtitle": "..." },
  "programs": {
    "health":  { "name": "Здоров'я",  "description": "..." },
    "classic": { "name": "Класична", "description": "..." }
  },
  "prices": {
    "section_title": "Прайс саун",
    "rental_per_hour_label": "Оренда сауни",
    "rental_per_hour_value": "1000 грн/год",
    "phone_fallback_label": "або за тел"
  },
  "booking": {
    "cta_label": "Забронювати парну",
    "technical_paragraph": "..."
  }
}
```

- [ ] **Step 1: Run extraction pattern**

Carefully — the page has been edited in many recent commits (memories `1709–1737`). Preserve all existing layout. Only swap inline strings for `t()` calls.

- [ ] **Step 2: Sync and verify**

```bash
npm run i18n:sync
npm run dev
```

Open `/sauna` and `/en/sauna`. Especially check the `#prices` section (recently de-duplicated) and the booking CTA placement.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/SaunaFromClientFull.tsx src/app/\[locale\]/sauna/page.tsx messages/uk.json messages/en.json messages/.hashes.json
git commit -m "feat(i18n): extract /sauna page strings"
```

---

### Task 20: Extract `/restaurant` page + `RestaurantHallsFromClient`, `RestaurantKidsRoom`, `RestaurantKidsMusic`, `RestaurantCtaStrip`

**Files:**
- Modify: `src/components/sections/Restaurant*.tsx`
- Modify: `src/app/[locale]/restaurant/page.tsx`
- Modify: `messages/uk.json` (under `restaurant.*`)

Use namespace `restaurant.{halls,kids_room,kids_music,cta_strip,...}`.

- [ ] **Step 1: Run extraction pattern**
- [ ] **Step 2: Sync and verify (`/restaurant`, `/en/restaurant`)**
- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Restaurant*.tsx src/app/\[locale\]/restaurant/page.tsx messages/uk.json messages/en.json messages/.hashes.json
git commit -m "feat(i18n): extract /restaurant page strings"
```

---

### Task 21: Extract `/hotel`, `/aquapark` pages

**Files:**
- Modify: `src/app/[locale]/hotel/page.tsx`
- Modify: `src/app/[locale]/aquapark/page.tsx`
- Modify: `messages/uk.json` (under `hotel.*` and `aquapark.*`)

- [ ] **Step 1: Run extraction pattern for both pages**
- [ ] **Step 2: Sync and verify (`/hotel`, `/en/hotel`, `/aquapark`, `/en/aquapark`)**
- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/hotel/page.tsx src/app/\[locale\]/aquapark/page.tsx messages/uk.json messages/en.json messages/.hashes.json
git commit -m "feat(i18n): extract /hotel and /aquapark page strings"
```

---

### Task 22: Extract `/menu` page + `menu.json` data file

**Files:**
- Modify: `src/data/menu.json`
- Modify: `src/app/[locale]/menu/page.tsx`
- Modify: `messages/uk.json` (under `menu.*` for UI chrome only)

- [ ] **Step 1: Inspect current menu.json structure**

```bash
head -40 src/data/menu.json
```

- [ ] **Step 2: Add `name_en` and `description_en` fields to each item**

Schema becomes:

```json
{
  "name": "Маргарита",
  "name_en": "Margherita",
  "description": "...",
  "description_en": "...",
  "price": 250
}
```

(Field names per current schema — adjust if the file uses different keys.)

- [ ] **Step 3: Translate item names/descriptions**

Use DeepL via the sync script — but `menu.json` is not in `messages/` so it won't be auto-synced. Either:
- (a) Add a small script `scripts/i18n/sync-menu.ts` modeled on `sync.ts` that reads `menu.json`, fills `*_en` fields where missing, writes back. Run via `npm run i18n:sync:menu`.
- (b) Or move menu copy into `messages/uk.json` under `menu.items.{slug}.{name,description}` and load by ID. Cleaner long-term.

**Recommended: (a)** — keeps the existing data shape, just adds parallel English fields. Less invasive.

Implement script (a) following the same DeepL+glossary pattern as `sync.ts`. Add npm script. Run it.

- [ ] **Step 4: Update `/menu/page.tsx` to display localized fields**

Add a small helper:

```typescript
import { useLocale } from 'next-intl';

const locale = useLocale();
const itemName = locale === 'en' ? item.name_en ?? item.name : item.name;
const itemDesc = locale === 'en' ? item.description_en ?? item.description : item.description;
```

Replace UI chrome strings (page title, "Add to cart", category headings) with `t()` calls under `menu.*`.

- [ ] **Step 5: Verify, commit**

```bash
npm run i18n:sync && npm run i18n:sync:menu
npm run dev   # check /menu and /en/menu
git add src/data/menu.json src/app/\[locale\]/menu/page.tsx scripts/i18n/sync-menu.ts package.json messages/uk.json messages/en.json messages/.hashes.json
git commit -m "feat(i18n): localize /menu page + dual-locale menu.json schema"
```

---

### Task 23: Extract `/gallery`, `/privacy`, `/terms` pages

**Files:**
- Modify: `src/app/[locale]/gallery/page.tsx`
- Modify: `src/app/[locale]/privacy/page.tsx`
- Modify: `src/app/[locale]/terms/page.tsx`
- Modify: `messages/uk.json` (under `gallery.*`, `privacy.*`, `terms.*`)

Privacy and terms have long legal text — copy verbatim into the JSON files. DeepL handles legal text well, but flag for human review afterward.

- [ ] **Step 1: Run extraction pattern for each page**
- [ ] **Step 2: Sync and verify**
- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/gallery/page.tsx src/app/\[locale\]/privacy/page.tsx src/app/\[locale\]/terms/page.tsx messages/uk.json messages/en.json messages/.hashes.json
git commit -m "feat(i18n): extract gallery/privacy/terms page strings"
```

---

### Task 24: Extract `/other-services/[slug]` and 8 specific service pages

**Files:**
- Modify: `src/app/[locale]/other-services/[slug]/page.tsx`
- Modify: `src/app/[locale]/other-services/{apitherapy,bbq-zone,brewery-tour,horses,kids-parties,paintball,petting-zoo,wedding}/page.tsx`
- Modify: `messages/uk.json` (under `other_services.*`)

Likely each service page is short. Use namespace `other_services.{slug}.{title,description,...}`.

- [ ] **Step 1: Inventory each page**

```bash
for f in src/app/\[locale\]/other-services/*/page.tsx; do
  echo "=== $f ==="
  head -50 "$f"
done
```

- [ ] **Step 2: Run extraction pattern for each page (commit after each, so PR diffs stay reviewable — 8 commits)**
- [ ] **Step 3: Verify all 8 pages render in both locales**

---

### Task 25: Extract booking flow pages

**Files:**
- Modify: `src/app/[locale]/sauna/booking/page.tsx`, `success/page.tsx`, `fail/page.tsx`
- Modify: `src/app/[locale]/hotel/booking/page.tsx`, `success/page.tsx`, `fail/page.tsx`
- Modify: `src/app/[locale]/aquapark/buy/page.tsx`, `success/page.tsx`, `fail/page.tsx`
- Modify: `src/app/[locale]/menu/checkout/page.tsx`, `success/page.tsx`, `fail/page.tsx`
- Modify: `messages/uk.json` (under `booking.*`)

These pages share patterns: form, status messages, retry buttons. Use:

```json
"booking": {
  "common": {
    "back_to_site": "Повернутися на сайт",
    "try_again": "Спробувати ще раз",
    "success_heading": "Дякуємо!",
    "success_body": "...",
    "fail_heading": "Помилка оплати",
    "fail_body": "..."
  },
  "sauna":     { "page_title": "...", "form_heading": "..." },
  "hotel":     { "page_title": "...", "form_heading": "..." },
  "aquapark":  { "page_title": "...", "form_heading": "..." },
  "menu":      { "page_title": "...", "form_heading": "..." }
}
```

- [ ] **Step 1: Run extraction pattern for each booking flow (4 flows × 3 pages = 12 files)**
- [ ] **Step 2: Sync, verify each flow in both locales**
- [ ] **Step 3: Commit per flow (4 commits)**

---

### Task 26: Extract booking UI components

**Files:**
- Modify: `src/components/ui/BookingButton.tsx`
- Modify: `src/components/ui/BookingDialog.tsx`
- Modify: `src/components/ui/BookingReviews.tsx`
- Modify: `src/components/ui/CookieConsent.tsx`
- Modify: `src/components/ui/FloatingButtons.tsx`
- Modify: `src/components/ui/FontSwitcher.tsx`
- Modify: `src/components/ui/GoogleReviews.tsx`
- Modify: `src/components/ui/InstagramFeed.tsx`
- Modify: `messages/uk.json` (under `ui.*` and component-specific namespaces)

Pay special attention to validation messages in `BookingDialog` (likely uses `zod` schemas). For zod messages, use:

```typescript
import { useTranslations } from 'next-intl';
const t = useTranslations('booking.validation');

const schema = z.object({
  name: z.string().min(2, t('name_min')),
  phone: z.string().regex(/^\+?\d{10,}$/, t('phone_invalid')),
  // ...
});
```

For server-side validation, use `getTranslations`.

- [ ] **Step 1: Run extraction pattern for each UI component**
- [ ] **Step 2: Sync, dev-verify booking dialog opens with EN labels and EN validation messages**
- [ ] **Step 3: Commit per component group (3-4 commits to keep diffs reviewable)**

---

### Task 27: Extract remaining sections (`HeroSection`, `HeroSlider`, `LocationSection`, `SectionDivider`, `ServicesGrid`)

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`, `HeroSlider.tsx`, `LocationSection.tsx`, `SectionDivider.tsx`, `ServicesGrid.tsx`
- Modify: `messages/uk.json` (under section-specific namespaces)

- [ ] **Step 1: Run extraction pattern**
- [ ] **Step 2: Sync, verify any page using these sections**
- [ ] **Step 3: Commit**

---

### Task 28: Extract `src/constants/index.ts`

**Files:**
- Modify: `src/constants/index.ts`
- Modify: `messages/uk.json` (under `services.main.*`, `services.additional.*`, `contact.*`)

`MAIN_SERVICES` and `ADDITIONAL_SERVICES` are arrays of objects with `title` / `description`. Two strategies:

**Strategy (a) — keep arrays as data, store text by ID**: each service gets a stable `id` (which it already has). UI looks up `t(`services.main.${id}.title`)`.

**Strategy (b) — move arrays to messages**: define under `services.main` as a keyed object instead of an array.

**Use (a)** — preserves the existing array shape, only swaps text fields for translation lookups.

```typescript
// In a component that consumes services:
import { useTranslations } from 'next-intl';
const t = useTranslations('services');

{MAIN_SERVICES.map(s => (
  <Card key={s.id}>
    <h3>{t(`main.${s.id}.title`)}</h3>
    <p>{t(`main.${s.id}.description`)}</p>
  </Card>
))}
```

`CONTACT_INFO.workingHours` becomes `t('contact.working_hours')`.

- [ ] **Step 1: Inventory current constants**
- [ ] **Step 2: Add keys to messages/uk.json**
- [ ] **Step 3: Update consumers (find with `grep -r "MAIN_SERVICES\|ADDITIONAL_SERVICES\|CONTACT_INFO" src/`)**
- [ ] **Step 4: Sync, verify, commit**

```bash
git commit -m "feat(i18n): extract services + contact info constants"
```

---

## Phase 5 — SEO

### Task 29: Add `generateMetadata` to every page

**Files:**
- Modify: every `page.tsx` under `src/app/[locale]/**`
- Modify: `messages/uk.json` (under `meta.*` per page)

Add to each page:

```typescript
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.<page-slug>' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
    },
  };
}
```

`messages/uk.json` adds:

```json
"meta": {
  "home":       { "title": "...", "description": "...", "og_title": "...", "og_description": "..." },
  "sauna":      { ... },
  "restaurant": { ... },
  ...
}
```

- [ ] **Step 1: Add `meta.*` keys for every page**
- [ ] **Step 2: Add `generateMetadata` to every page (or update existing if already present)**
- [ ] **Step 3: Sync EN, verify metadata via DevTools**

```bash
curl -s http://localhost:3000/en/sauna | grep -E '<title>|<meta name="description"' | head -3
```

Expected: title and description in English.

- [ ] **Step 4: Commit per group of pages**

---

### Task 30: Add hreflang tags to root locale layout

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Add hreflang in metadata**

In `[locale]/layout.tsx`, extend `generateMetadata` to inject `alternates`:

```typescript
export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://gluhoman.com.ua'; // TODO swap to final domain

  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: locale === 'uk' ? '/' : '/en',
      languages: {
        uk: '/',
        en: '/en',
        'x-default': '/',
      },
    },
  };
}
```

(The per-page `generateMetadata` from Task 29 will further override `canonical` and per-page `alternates.languages`. Standard pattern in next-intl docs.)

- [ ] **Step 2: Verify hreflang renders**

```bash
curl -s http://localhost:3000/sauna | grep -E 'rel="alternate"' | head -5
```

Expected: at least three `<link rel="alternate" hreflang="...">` tags.

- [ ] **Step 3: Commit**

---

### Task 31: Update sitemap for multi-locale

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Read current sitemap**

```bash
cat src/app/sitemap.ts
```

- [ ] **Step 2: Generate dual-locale entries**

For each route, emit one entry per locale with `alternates.languages`:

```typescript
import type { MetadataRoute } from 'next';

const ROUTES = ['', '/sauna', '/restaurant', '/hotel', '/aquapark', '/menu', '/gallery', '/privacy', '/terms', /* + other-services slugs */];
const BASE = 'https://gluhoman.com.ua';

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((path) => [
    {
      url: `${BASE}${path || '/'}`,
      alternates: {
        languages: {
          uk: `${BASE}${path || '/'}`,
          en: `${BASE}/en${path}`,
        },
      },
    },
    {
      url: `${BASE}/en${path}`,
      alternates: {
        languages: {
          uk: `${BASE}${path || '/'}`,
          en: `${BASE}/en${path}`,
        },
      },
    },
  ]);
}
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:3000/sitemap.xml | head -40
```

Expected: contains entries for both `/sauna` and `/en/sauna`, with `<xhtml:link>` alternates.

- [ ] **Step 4: Commit**

---

## Phase 6 — Initial sync polish + ESLint guard

### Task 32: Hand-tune sauna program names + brand glossary entries

**Files:**
- Modify: `messages/en.json` (manual edits)
- Modify: `scripts/i18n/glossary.ts` (additions)

After all extraction tasks, sauna program names will appear in `en.json` as raw transliterations (e.g. `"Zdorovya"`). Decide with the user whether to add an English gloss like `"Zdorovya — Health Ritual"`.

- [ ] **Step 1: Inspect current en.json values**

```bash
grep -A 1 '"name":' messages/en.json | grep -i 'zdorovya\|klasychna\|glukhoman' | head -10
```

- [ ] **Step 2: Update glossary if user wants gloss form**

Add to `scripts/i18n/glossary.ts`:

```typescript
{ uk: "Здоров'я", en: 'Zdorovya — Health Ritual' },
{ uk: 'Класична', en: 'Klasychna — Classic Ritual' },
```

(Replacing the previous bare-transliteration entries.)

- [ ] **Step 3: Force re-sync (delete the affected hashes to trigger re-translate)**

```bash
node -e "const f=require('./messages/.hashes.json'); for(const k of Object.keys(f)) if(k.includes('programs')) delete f[k]; require('fs').writeFileSync('./messages/.hashes.json', JSON.stringify(f, null, 2));"
npm run i18n:sync
```

- [ ] **Step 4: Visual verify on `/en/sauna`, commit**

---

### Task 33: Add ESLint rule blocking Cyrillic in JSX

**Files:**
- Create: `eslint-rules/no-cyrillic-jsx.js`
- Modify: `eslint.config.mjs` (or `.eslintrc.*`)

- [ ] **Step 1: Read current ESLint config**

```bash
ls -la eslint.config.* .eslintrc.*
```

- [ ] **Step 2: Write the local rule**

`eslint-rules/no-cyrillic-jsx.js`:

```javascript
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow Cyrillic literals in JSX text/attrs (use t() instead)' },
    messages: { hardcoded: 'Hardcoded Cyrillic detected: "{{text}}". Move to messages/uk.json and use t().' },
  },
  create(context) {
    const CYR = /[Ѐ-ӿ]/;
    return {
      JSXText(node) {
        if (CYR.test(node.value) && node.value.trim().length > 0) {
          context.report({ node, messageId: 'hardcoded', data: { text: node.value.trim().slice(0, 40) } });
        }
      },
      Literal(node) {
        if (
          typeof node.value === 'string' &&
          CYR.test(node.value) &&
          node.parent &&
          node.parent.type === 'JSXAttribute'
        ) {
          context.report({ node, messageId: 'hardcoded', data: { text: node.value.slice(0, 40) } });
        }
      },
    };
  },
};
```

- [ ] **Step 3: Register the rule in ESLint config**

In `eslint.config.mjs`, add an entry for `messages/`-excluded paths. Example flat-config form:

```javascript
import noCyrillicJsx from './eslint-rules/no-cyrillic-jsx.js';

export default [
  // ... existing config
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { local: { rules: { 'no-cyrillic-jsx': noCyrillicJsx } } },
    rules: { 'local/no-cyrillic-jsx': 'warn' },
  },
];
```

- [ ] **Step 4: Run lint**

```bash
npm run lint
```

If extraction was thorough, no warnings. If warnings appear — those are missed strings; fix them and re-sync.

- [ ] **Step 5: Commit**

---

## Phase 7 — Verification & deploy

### Task 34: Manual smoke test in browser

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test matrix (open each in browser, verify no Cyrillic on EN, no missing keys)**

- `/` and `/en`
- `/sauna` and `/en/sauna` — including `#prices` section
- `/restaurant` and `/en/restaurant`
- `/hotel` and `/en/hotel`
- `/aquapark` and `/en/aquapark`
- `/menu` and `/en/menu` — including item names/descriptions
- `/gallery` and `/en/gallery`
- `/privacy` and `/en/privacy`
- `/terms` and `/en/terms`
- All 8 `/other-services/<slug>` pages, both locales
- `/sauna/booking`, `/sauna/booking/success`, `/sauna/booking/fail` (and EN)
- Same for hotel, aquapark, menu booking flows

- [ ] **Step 3: Test language switcher**

On each main page, click EN flag → URL gains `/en/`, content switches. Click UA → URL drops `/en/`. Verify cookie `NEXT_LOCALE` is set in DevTools.

- [ ] **Step 4: Test Accept-Language detection**

In DevTools, send a request with `Accept-Language: en-US`:

```bash
curl -sI -H 'Accept-Language: en-US' http://localhost:3000/ | grep -i location
```

Expected: `Location: /en` (302 redirect).

- [ ] **Step 5: Test booking dialog validation in EN**

Open `/en/sauna`, click booking CTA, leave fields empty, submit — verify validation messages are in English.

- [ ] **Step 6: Test page metadata**

```bash
curl -s http://localhost:3000/en/sauna | grep -E '<title>|<meta name="description"|hreflang' | head -8
```

Expected: title in EN, description in EN, hreflang for both UK and EN.

If any failures: fix, sync, re-verify.

---

### Task 35: Production build + deploy

- [ ] **Step 1: Production build locally**

```bash
npm run build
```

Expected: build succeeds. If `next-intl` strict mode reports missing keys, those are bugs — add the missing keys, sync, retry.

- [ ] **Step 2: Run check before deploy**

```bash
npm run i18n:check
npm run lint
```

Both must pass.

- [ ] **Step 3: Open PR for review**

```bash
gh pr create --base main --title "feat: add English localization (next-intl + DeepL sync)" --body "$(cat <<'EOF'
## Summary
- Adds `/en/...` localized version of every public page using `next-intl`
- Browser-language auto-detect via middleware (Accept-Language header)
- Round flag-button language switcher in header (UA / EN)
- DeepL-driven translation maintenance: `npm run i18n:sync`
- Drift prevention: husky pre-commit hook + CI check + ESLint Cyrillic rule
- All 30+ public pages translated; admin and API routes unchanged

## Test plan
- [x] Visit `/` with English browser — auto-redirected to `/en`
- [x] Visit `/` with Ukrainian browser — stays on `/`
- [x] Click EN flag on any page — switches to `/en/<same-path>`
- [x] All public pages render in both locales
- [x] Booking dialog validation messages translated
- [x] hreflang tags + sitemap include both locales
- [x] `npm run i18n:check` passes
- [x] Pre-commit hook blocks UA-only edits

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: After PR review and merge, deploy to production VPS**

Production deploy follows the existing pattern (see prior commits like `1717` and `1723`):

```bash
ssh root@72.60.16.73 'cd /opt/gluhoman-land && git pull && docker compose -f docker-compose.prod.yml build web && docker compose -f docker-compose.prod.yml up -d web'
```

(Adjust to actual deploy script — refer to `docs/DEPLOYMENT.md` and `docs/PRODUCTION.md`.)

- [ ] **Step 5: Verify production**

```bash
curl -sI -H 'Accept-Language: en-US' http://72.60.16.73/ | head -5
curl -s http://72.60.16.73/en/sauna | grep -o '<title>[^<]*</title>'
```

Expected: 302 to `/en` for English browser; English title on `/en/sauna`.

Visit `http://72.60.16.73/en` in a real browser — verify rendering, switcher, booking flow end-to-end.

- [ ] **Step 6: Tag the release**

```bash
git tag -a v-i18n-en -m "English localization launched"
git push --tags
```

---

## Acceptance Criteria (final)

- [ ] Visiting `/` with `Accept-Language: en-US` returns 302 to `/en` (verified by curl).
- [ ] Visiting `/` with default UA browser stays on `/`.
- [ ] Cookie `NEXT_LOCALE=uk` overrides English browser detection.
- [ ] All 30+ public pages render in both locales with no missing-key errors at build time.
- [ ] No Cyrillic anywhere on `/en/*` (grep on rendered HTML returns empty).
- [ ] Language switcher in header: clicking inactive flag navigates to same path in other locale, preserves hash fragments, sets cookie.
- [ ] Booking forms (sauna/hotel/aquapark/menu) submit successfully in both locales; validation messages localized.
- [ ] `npm run i18n:check` exits 0 on clean main.
- [ ] Editing a value in `uk.json` and trying to commit without re-sync is blocked by pre-commit hook.
- [ ] hreflang tags present on every page; sitemap.xml includes both locale URLs.
- [ ] Production deploy on `72.60.16.73` serves both `/<page>` and `/en/<page>` with 200 OK.
- [ ] `npm run lint` reports no `local/no-cyrillic-jsx` warnings on `src/`.

---

## Notes for the implementing engineer

- **Always run `npm run i18n:sync` after editing `messages/uk.json`** — pre-commit hook will block you otherwise.
- **Server vs client components:** `useTranslations` requires a client component (`'use client'`). For server components, use `getTranslations` from `next-intl/server` (`async`).
- **Internal links:** Replace `<Link from 'next/link'>` with `<Link from '@/i18n/routing'>` — the routing-aware Link auto-prefixes locale. `<a href>` tags for external URLs stay untouched.
- **`useRouter`/`usePathname`/`redirect`:** All come from `@/i18n/routing`, not from `next/navigation`. The locale-aware versions handle path rewriting.
- **DeepL Free tier rate-limits:** ~500k chars/month. Site total is well under that. If you ever hit a limit, the script logs the error and continues — fix and re-run.
- **Don't translate admin/API:** `/admin/*` and `/api/*` are explicitly excluded by the middleware matcher. Never move admin pages into `[locale]`.
- **Brand glossary:** if DeepL gives a wrong translation for a brand-specific term, add a glossary entry in `scripts/i18n/glossary.ts` and re-sync. Don't hand-edit `en.json` — it'll be overwritten on the next `uk.json` change.
- **Memory rules apply:** Read `MEMORY.md` before starting — this project has rules about brand colors (green + white only), dev-server workflow, and now i18n sync workflow.
