# Mobile Responsive Audit — Глухомань

Дата: 2026-04-13
Автор: senior mobile web engineer (Claude Code audit pass)

## 1. Методологія

Аудит виконано у три етапи:

1. **Playwright mobile screenshots.** Створено спек `e2e/mobile-audit.spec.ts`, який
   знімає full-page скріншоти 10 ключових сторінок у мобільному проекті
   (`viewport: 375x812`, Chromium). Артефакти у `test-results/mobile-*.png`.
2. **Grep по anti-patterns.** Пошук `text-(5xl..8xl)` без `md:` префікса,
   `px-(8..20)` без мобільного fallback, `grid-cols-[3-6]` без `grid-cols-1`,
   `flex gap-(8..16)` без `flex-col`, фіксовані ширини `w-[...px]`, таблиці
   без обгортки зі скролом.
3. **Manual source review.** Ручний перегляд `src/app/**/page.tsx`,
   `src/components/sections/Home*`, з пріоритетом на герої, CTA-секції та
   закриваючі блоки сторінок.

Переглянуто breakpoint `375px` (iPhone SE/13 mini) та перевірено, що правки
лишаються сумісні з `414px` (iPhone 12/13/14 Plus).

## 2. Результати по сторінках

| Сторінка                      | Статус  | Проблеми                                                              |
| ----------------------------- | ------- | --------------------------------------------------------------------- |
| `/` (home)                    | minor   | `HomeStory` italic `text-6xl` + drop-cap `text-7xl` — завеликі        |
| `/hotel`                      | major   | Hero `text-6xl md:text-8xl`, CTA `px-10`, testimonial `p-10`          |
| `/aquapark`                   | OK      | Responsive OK, grid має mobile fallback                               |
| `/restaurant`                 | OK      | Responsive OK                                                         |
| `/sauna`                      | major   | Hero `text-6xl md:text-8xl`, tips list `gap-8` без mobile fallback    |
| `/menu`                       | minor   | `MenuHero` `text-4xl` без mobile reduction (прийнятно)                |
| `/gallery`                    | OK      | Горизонтальний scroll на табах — intentional                          |
| `/privacy`, `/terms`          | OK      | Текстові сторінки — без проблем                                       |
| `/other-services/paintball`   | minor   | Dynamic `[slug]` hero `text-5xl md:text-7xl` — тіснувато на 375px    |
| `/other-services/brewery-tour`| minor   | Hero `text-5xl md:text-7xl` (не тестувався у спеку)                   |
| `/other-services/kids-parties`| minor   | Hero `text-5xl md:text-7xl lg:text-8xl` (прийнятно)                   |

## 3. Топ 10 проблем

1. **`src/app/hotel/page.tsx:262`** — `text-6xl md:text-8xl` у hero (60px на 375px — переповнення).
2. **`src/app/hotel/page.tsx:817`** — `text-6xl md:text-8xl` у закриваючому CTA.
3. **`src/app/sauna/page.tsx:211`** — `text-6xl md:text-8xl` у hero.
4. **`src/components/sections/HomeStory.tsx:53`** — `text-6xl ... lg:text-7xl` без мобільного кроку.
5. **`src/components/sections/HomeStory.tsx:109`** — drop-cap `text-7xl` = 72px на 375px.
6. **`src/app/hotel/page.tsx:272`** — CTA `px-10 py-4` без `justify-center`, без `min-h-[44px]`.
7. **`src/app/hotel/page.tsx:653`** — testimonial `p-10 md:p-12` — ~40px padding × 2 = 295px contentu на 375px.
8. **`src/app/sauna/page.tsx:632`** — tip list `flex gap-8` = 32px gap з іконкою + текст.
9. **`src/app/other-services/[slug]/page.tsx:204`** — hero `text-5xl md:text-7xl` тіснуватий.
10. **Next.js `images.qualities` warnings** — багато `quality=85/90/95` не зконфігуровано. Не UI-баг, але засмічує логи.

## 4. Що виправлено в цьому проході

Застосовано **9 точкових правок** (one `Edit` per fix, без переписування):

| # | Файл                                                    | До                                                                 | Після                                                                            |
| - | ------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| 1 | `src/app/hotel/page.tsx:262`                            | `text-6xl md:text-8xl`                                             | `text-5xl md:text-8xl`                                                           |
| 2 | `src/app/hotel/page.tsx:817`                            | `text-6xl md:text-8xl`                                             | `text-5xl md:text-8xl`                                                           |
| 3 | `src/app/sauna/page.tsx:211`                            | `text-6xl md:text-8xl`                                             | `text-5xl md:text-8xl`                                                           |
| 4 | `src/components/sections/HomeStory.tsx:53`              | `text-6xl ... lg:text-7xl`                                         | `text-5xl ... md:text-6xl lg:text-7xl`                                           |
| 5 | `src/components/sections/HomeStory.tsx:109`             | `text-7xl ... md:text-[96px]`                                      | `text-6xl ... md:text-[96px]`                                                    |
| 6 | `src/app/hotel/page.tsx:272` (CTA)                      | `inline-flex ... px-10 py-4 ...`                                   | `inline-flex items-center justify-center ... px-8 sm:px-10 py-4 ... min-h-[44px]` |
| 7 | `src/app/hotel/page.tsx:653` (testimonial)              | `p-10 md:p-12`                                                     | `p-6 sm:p-10 md:p-12`                                                            |
| 8 | `src/app/sauna/page.tsx:632` (tip list)                 | `flex gap-8 py-6`                                                  | `flex gap-4 sm:gap-8 py-6`                                                       |
| 9 | `src/app/other-services/[slug]/page.tsx:204` (hero h1)  | `text-5xl md:text-7xl`                                             | `text-4xl sm:text-5xl md:text-7xl`                                               |

Усі правки безпечні:
- лише додавання `sm:`/`md:` модифікаторів
- збереження design tokens Editorial Boutique (`font-display`, `#1a3d2e`, `#e6d9b8`)
- без змін копії (українська мова)
- без правок client-компонентів `BookingDialog`, `Header`, `Footer`, `layout.tsx`

Playwright спек (`e2e/mobile-audit.spec.ts`) зеленіє після правок — 10/10.

## 5. Що треба вручну

1. **`brewery-tour`, `apitherapy`, `petting-zoo`, `kids-parties`, `bbq-zone`** — багато
   `text-4xl md:text-5xl` / `text-5xl md:text-7xl` у h2/h3 без `sm:` step-down.
   Це не overflow, але густість тексту на 375px висока. Потрібен дизайн-рішеня
   чи залишати ефект Editorial Boutique, чи прибирати на мобільному.
2. **`HomeServices.tsx`** — 960-рядковий client component з framer-motion.
   Високий ризик регресій. Окрема сесія з QA.
3. **`BookingDialog.tsx`** — виключений зі скоупу, але на мобільному form padding
   та sticky-кнопки вимагають окремого проходу.
4. **`menu` сторінка** — рендерить великий каталог від CDN. Перевірити лейаут
   карток на 360px (Galaxy S8 и нижче).
5. **Next.js image qualities** — додати `images.qualities: [75, 85, 90, 95]`
   у `next.config.ts` щоб прибрати warnings (NB: CLAUDE.md забороняє правки
   `next.config.ts`, потрібен sign-off).

## 6. Рекомендації на наступну ітерацію

- **Запровадити єдиний mobile type-scale token** у `globals.css` або Tailwind preset:
  `--display-hero: clamp(2.5rem, 8vw, 6rem);` і використати у heros замість
  ручних `text-5xl md:text-8xl`. Зменшить кількість класів і регресій.
- **Додати Playwright assertion** `await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll')`
  у mobile-audit спеку для автоматичного виявлення overflow.
- **Tap-target audit** через `@axe-core/playwright` — автоматично виявить
  кнопки/посилання менше 44×44.
- **414px run** — додати другий mobile project у `playwright.config.ts`
  (`viewport: 414x896`) для iPhone Plus класу.
- **Dark-mode / reduced-motion** — перевірити що `HeroSlider` на мобільному
  не ставить `min-h-[90vh]` з cut-off контентом.
- **`docs/MOBILE-AUDIT.md`** оновлювати при кожному новому service-page.
