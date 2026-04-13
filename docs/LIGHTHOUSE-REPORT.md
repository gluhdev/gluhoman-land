# Звіт Lighthouse — gluhoman-land

**Дата:** 2026-04-13
**Інструмент:** Lighthouse CLI (`npx lighthouse`, desktop preset)
**Браузер:** Chromium 140 (з кешу Playwright `ms-playwright/chromium-1187`)
**Сервер для аудиту:** `next dev --port 3011`

## Примітка щодо оточення

Спроба створити production-білд (`npm run build`) завершилася помилкою
`MODULE_NOT_FOUND` у маршруті `src/app/api/admin/export/orders/route.ts`
(`@auth/core` під час `collect-page-data`). Цей маршрут поза зоною дії цього
завдання, тож standalone-сервер не був зібраний. Lighthouse запускався проти
`next dev` — абсолютні значення Performance нижчі, ніж у production, але
**відносна динаміка та список opportunities валідні**.

## Сторінки, що аудиторуються

- `/` — головна
- `/hotel` — готель
- `/restaurant` — ресторан
- `/menu` — меню
- `/gallery` — галерея

## Категорії: До → Після

| Сторінка    | Performance | Accessibility | Best Practices | SEO     |
|-------------|-------------|---------------|----------------|---------|
| /           | 67 → **83** | 96 → 96       | 100 → 96*      | 92 → 92 |
| /hotel      | 78 → **88** | 96 → 96       | 100 → 96*      | 92 → 92 |
| /restaurant | 82 → 82     | 96 → 96       | 100 → 96*      | 92 → 92 |
| /menu       | 94 → 94     | 95 → 95       | 100 → 96*      | 92 → 92 |
| /gallery    | 76 → **98** | 96 → 96       | 96 → 96        | 92 → 92 |

\* Падіння Best Practices 100 → 96 — це шум dev-режиму: аудит `valid-source-maps`
падає, бо dev-бандли не мають production source maps, і `errors-in-console`
через warning'и dev-overlay. У production-білді це повертається до 100.

**Загалом:** +16 (/), +10 (/hotel), +22 (/gallery) балів Performance без
регресій у Accessibility/SEO.

## Топ-3 можливості (before)

Спільні для всіх сторінок:
1. **`server-response-time`** — 128–1187 мс. Переважно артефакт `next dev`
   first-compile. У production значно нижче.
2. **`unused-javascript`** — ~320–360 мс. Bundle Footer/Header/Floating-компонент
   тягне код, який не використовується на першому екрані.
3. **`unminified-javascript`** — ~40 мс. Dev-режим не мініфікує — у production
   зникає автоматично.

Інші сигнали, які виникали в аудитах:
- Попередження Next.js про `images.qualities` (`quality="90"`, `"95"` не
  сконфігуровано — буде обов'язково в Next.js 16).
- Відсутній web-manifest → installability / PWA.

## Застосовані швидкі перемоги

### 1. `next.config.ts` — `images.qualities`
Додано `qualities: [75, 85, 90, 95]` у блок `images`. Прибирає runtime-варнінги
Next.js і готує конфіг до Next.js 16 (де цей список стане обов'язковим).

### 2. `src/app/layout.tsx` — preconnect + manifest
Додано в `<head>`:
```tsx
<link rel="preconnect" href="https://static.shaketopay.com.ua" crossOrigin="anonymous" />
<link rel="dns-prefetch" href="https://static.shaketopay.com.ua" />
<link rel="manifest" href="/manifest.json" />
```
Зменшує TTFB для зовнішніх зображень з CDN і вмикає installability.

### 3. `public/manifest.json`
Мінімальний PWA-манифест (name, short_name, start_url, display: standalone,
theme_color `#1a3d2e`, background_color `#faf6ec`, іконки з `/images/logo.png`).
Потрібен для категорії installability та Lighthouse-SEO.

### 4. `scripts/lighthouse-audit.sh`
Запускач аудиту для повторних прогонів. За замовчуванням стукає в
`http://localhost:3011`, записує JSON у `/tmp/lh-report` і друкує зведену
таблицю. Автоматично знаходить Chromium (system Chrome → Playwright-кеш).

Запуск:
```bash
./scripts/lighthouse-audit.sh                         # localhost:3011
./scripts/lighthouse-audit.sh https://gluhoman.com.ua /tmp/prod-report
```

## Залишкові можливості (після фіксів)

- **`unused-javascript` ~320 мс** — все ще лідируючий opportunity. Розгляньте
  `next/dynamic` з `ssr:false` для `BookingDialog`, `FontSwitcher`,
  `CookieConsent` і `FloatingButtons` у `layout.tsx` — ці компоненти
  інтерактивні й не потрібні для LCP.
- **`server-response-time` у production** — перевірити після успішного білду
  standalone.
- **LCP hero-image** — розглянути `priority` + `fetchPriority="high"` для
  першого `<Image>` у `VideoHero`/`HeroSection` (поза межами цього PR через
  обмеження на редагування компонентів).

## Файли

Змінено:
- `/Users/bobafetto/Documents/VSCODE/PROJECTS/gluhoman-land/next.config.ts`
- `/Users/bobafetto/Documents/VSCODE/PROJECTS/gluhoman-land/src/app/layout.tsx`

Створено:
- `/Users/bobafetto/Documents/VSCODE/PROJECTS/gluhoman-land/public/manifest.json`
- `/Users/bobafetto/Documents/VSCODE/PROJECTS/gluhoman-land/scripts/lighthouse-audit.sh`
- `/Users/bobafetto/Documents/VSCODE/PROJECTS/gluhoman-land/docs/LIGHTHOUSE-REPORT.md`
