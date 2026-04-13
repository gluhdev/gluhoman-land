# Операційний посібник — Глухомань

Документ для власника/оператора сайту. Описує запуск, налаштування Telegram-бота для заявок, FontSwitcher, деплой та екстрене реагування.

---

## 1. Локальний запуск

Передумови: встановлені `Node.js 20+` та `git`.

```bash
git clone <repository-url> gluhoman-land
cd gluhoman-land
npm install
cp .env.example .env.local   # заповніть значення (див. розділ 2)
npm run dev -- --port 3002
```

Сайт буде доступний за адресою `http://localhost:3002`.

Інші команди:

```bash
npm run build    # production-збірка (Turbopack)
npm run start    # запуск production-збірки
npm run lint     # перевірка ESLint
```

---

## 2. Змінні середовища

Усі змінні задаються у файлі `.env.local` (локально) або у Vercel → Project Settings → Environment Variables (production).

| Змінна | Де використовується | Обовʼязкова | Що буде, якщо не задати |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `src/app/sitemap.ts`, `src/app/robots.ts`, `src/components/seo/StructuredData.tsx` | Так (для prod) | Sitemap, robots.txt і JSON-LD будуть містити неправильний/порожній домен — постраждає SEO |
| `TELEGRAM_BOT_TOKEN` | `src/app/actions/booking.ts` | Так (для прийому заявок) | Заявка не буде надіслана у Telegram. Server action впаде у fallback і запише дані у server log Vercel |
| `TELEGRAM_CHAT_ID` | `src/app/actions/booking.ts` | Так (для прийому заявок) | Те саме — заявка піде у server log замість Telegram |

Префікс `NEXT_PUBLIC_` означає, що змінна доступна у браузері. `TELEGRAM_*` — серверні, у браузер не потрапляють.

Після зміни змінних у Vercel потрібно зробити **Redeploy** проєкту.

---

## 3. Telegram бот для заявок

Заявки з форми бронювання (`BookingDialog`) надсилаються у ваш приватний канал/групу через Telegram-бота. Налаштування виконується один раз.

### 3.1 Створити бота

1. Відкрийте Telegram і знайдіть `@BotFather`.
2. Надішліть команду `/newbot`.
3. Введіть назву бота (наприклад, `Gluhoman Bookings`).
4. Введіть username бота (має закінчуватись на `bot`, наприклад `gluhoman_bookings_bot`).
5. BotFather видасть **token** виду `123456789:ABCdef...`. Скопіюйте і збережіть — це `TELEGRAM_BOT_TOKEN`.

### 3.2 Створити канал/групу для заявок

1. У Telegram створіть приватний канал або групу (рекомендуємо приватний канал).
2. Відкрийте налаштування каналу → **Administrators** → **Add Administrator**.
3. Знайдіть свого бота за username і додайте його як адміністратора. Достатньо права **Post Messages**.

### 3.3 Дізнатись `chat_id`

1. Надішліть будь-яке повідомлення у щойно створений канал (наприклад, "test").
2. У браузері відкрийте URL (підставивши свій token):

   ```
   https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates
   ```

3. У JSON-відповіді знайдіть поле `"chat":{"id": ...}`. Це і є `TELEGRAM_CHAT_ID`.
   - Для приватних каналів ID — від'ємне число, що починається з `-100` (наприклад, `-1001234567890`).
   - Для груп ID також від'ємне.
4. Якщо `getUpdates` повертає порожній масив `result: []`, видаліть бота з адмінів і додайте знову, надішліть нове повідомлення і повторіть запит.

### 3.4 Додати змінні у Vercel

1. Vercel → ваш проєкт → **Settings** → **Environment Variables**.
2. Додайте дві змінні для всіх середовищ (Production, Preview, Development):
   - `TELEGRAM_BOT_TOKEN` = токен з кроку 3.1
   - `TELEGRAM_CHAT_ID` = id з кроку 3.3
3. Натисніть **Redeploy** на останньому деплої, щоб зміни підхопились.

### 3.5 Перевірка

1. Відкрийте production-сайт.
2. Натисніть кнопку бронювання, заповніть форму, надішліть.
3. Перевірте, що повідомлення надійшло у канал.
4. Якщо ні — див. розділ 7 (Vercel logs).

### 3.6 Email через Resend (другий канал доставки)

Окрім Telegram, заявки можна дублювати на email через сервіс [Resend](https://resend.com). Обидва канали працюють **паралельно та незалежно**: якщо хоча б один з них успішно прийняв заявку — вона вважається доставленою. Якщо жоден не налаштований — заявка пишеться у server log Vercel (як і раніше).

**Крок 1. Акаунт і API-ключ**

1. Зареєструйтесь на [resend.com](https://resend.com).
2. **Domains** → **Add Domain** → введіть `gluhoman.com.ua`.
3. Додайте надані DNS-записи (SPF, DKIM) у реєстратора домену і дочекайтесь верифікації.
4. **API Keys** → **Create API Key** → скопіюйте ключ виду `re_...`. Це `RESEND_API_KEY`.

**Крок 2. Env-змінні у Vercel**

У Vercel → Settings → Environment Variables додайте для всіх середовищ:

- `RESEND_API_KEY` — ключ з кроку 1.
- `BOOKING_EMAIL_FROM` — відправник, наприклад `Глухомань <bookings@gluhoman.com.ua>`. Домен має бути верифікований у Resend.
- `BOOKING_EMAIL_TO` — email оператора, куди падають заявки. Можна вказати кілька адрес через кому: `a@x.ua, b@x.ua`.

Натисніть **Redeploy**, щоб зміни підхопились.

**Крок 3. Як це працює**

- Якщо гість вказав у формі свій email, заголовок `Reply-To` листа буде виставлений на його адресу — оператор може відповісти прямо з пошти.
- Якщо не налаштовані ані Telegram, ані Resend — заявки все одно з'являться у Vercel runtime logs.

---

## 4. FontSwitcher (інструмент дизайнера)

У нижньому лівому кутку сайту присутня кнопка **🎨 Fonts** — це тимчасовий перемикач шрифтових пар (`src/components/ui/FontSwitcher.tsx`, 20 готових пар для hospitality-сегменту).

### Як користуватись

1. Натисніть **🎨 Fonts** у нижньому лівому кутку.
2. Перебирайте пари — типографіка сайту змінюється наживо.
3. Зафіксуйте назву обраної пари і передайте розробнику для постійного впровадження.

### Як видалити перед продакшеном

FontSwitcher НЕ повинен лишатися у фінальному production-білді. Видалення:

1. У `src/app/layout.tsx` приберіть імпорт `FontSwitcher` та компонент `<FontSwitcher />` з JSX.
2. Видаліть файл `src/components/ui/FontSwitcher.tsx`.
3. Видаліть супутні константи з шрифтовими парами (зазвичай у `src/constants/`), якщо вони більше ніде не використовуються.
4. Запустіть `npm run build` локально для перевірки, що нічого не зламано.

Якщо щось незрозуміло — **зверніться до розробника**, не видаляйте навмання.

---

## 5. Деплой на Vercel

1. Запушити зміни у GitHub-репозиторій (гілка `main`).
2. Vercel → **Add New** → **Project** → імпортувати репозиторій з GitHub.
3. Framework Preset визначиться автоматично як **Next.js**.
4. У розділі **Environment Variables** додати всі три змінні з розділу 2.
5. Натиснути **Deploy**.
6. Після деплою прив'язати власний домен у **Settings → Domains** (`gluhoman.com.ua`).
7. Майбутні пуші у `main` будуть деплоїтись автоматично.

---

## 6. SEO checklist після деплою

Виконати один раз після першого production-деплою на робочому домені:

- [ ] **Google Search Console** — додати property `https://gluhoman.com.ua`, підтвердити власність (через DNS або файл), надіслати sitemap: `https://gluhoman.com.ua/sitemap.xml`.
- [ ] **Robots** — переконатись, що `https://gluhoman.com.ua/robots.txt` віддає коректний вміст і `NEXT_PUBLIC_SITE_URL` правильний.
- [ ] **Structured Data (JSON-LD)** — перевірити сторінки через [Google Rich Results Test](https://search.google.com/test/rich-results). JSON-LD генерується у `src/components/seo/StructuredData.tsx`.
- [ ] **OpenGraph** — перевірити вигляд посилань у соцмережах через [opengraph.xyz](https://www.opengraph.xyz/).
- [ ] **PageSpeed Insights** — прогнати головну сторінку через [PageSpeed Insights](https://pagespeed.web.dev/).

---

## 7. Контакти та екстрене реагування

### Якщо заявки з сайту не приходять у Telegram

1. **Перевірити змінні** у Vercel → Settings → Environment Variables: `TELEGRAM_BOT_TOKEN` і `TELEGRAM_CHAT_ID` мають бути задані для **Production**.
2. **Перевірити Vercel logs**:
   - Vercel → ваш проєкт → **Deployments** → останній деплой → **Functions** / **Runtime Logs**.
   - Шукати рядки з `booking` — server action логує дані заявки навіть якщо Telegram недоступний (fallback). Завдяки цьому жодна заявка не губиться повністю.
3. **Перевірити, що бот ще адмін** у каналі (його могли випадково видалити).
4. **Перевірити token** через `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getMe` — має повернути JSON з даними бота.
5. Якщо token скомпрометовано — у `@BotFather` команда `/revoke`, потім згенерувати новий, оновити у Vercel і зробити **Redeploy**.

### Fallback для заявок

Якщо Telegram повністю недоступний — server action `src/app/actions/booking.ts` записує дані заявки у Vercel runtime log. Оператор може щодня переглядати логи у вкладці **Logs** проєкту як резервний канал.

### Резервні канали комунікації

На сайті у Footer та Header вказані телефони — клієнти можуть зателефонувати напряму. Переконайтесь, що вони актуальні (`src/constants/index.ts`).

### Кого кликати на допомогу

- **Технічні питання (код, деплой, бот)** — розробник проєкту.
- **Домен / DNS** — реєстратор домену `gluhoman.com.ua`.
- **Vercel акаунт** — власник Vercel-організації.

## Plausible Analytics (приватна аналітика)

Plausible — легка, GDPR-сумісна аналітика без cookies. Інтегрована опційно: якщо змінні оточення не задані, скрипт не завантажується і сайт працює без змін.

### Налаштування

1. **Створіть акаунт** на [plausible.io](https://plausible.io) або розгорніть self-hosted інстанс.
2. Додайте сайт `gluhoman.com.ua` у панелі Plausible.
3. Встановіть змінні оточення у Vercel → Project Settings → Environment Variables:
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=gluhoman.com.ua`
   - Для self-hosted також: `NEXT_PUBLIC_PLAUSIBLE_HOST=https://analytics.example.com` (за замовчуванням `https://plausible.io`).
4. Передеплойте проєкт.

### Підключення компонента

Компонент `<Plausible />` знаходиться у `src/components/analytics/Plausible.tsx`. Його потрібно змонтувати в кінці `<body>` у `src/app/layout.tsx`:

```tsx
import Plausible from "@/components/analytics/Plausible";

// ...всередині <body>, наприкінці:
<Plausible />
```

> Примітка: монтування в `layout.tsx` виконується окремим кроком (інший агент або вручну), оскільки файл зараз може редагуватися паралельно.

### Кастомні події

Для відстеження користувацьких подій використовуйте типізований помічник:

```ts
import { trackEvent } from "@/lib/analytics";

trackEvent("booking_opened", { service: "hotel" });
trackEvent("phone_clicked");
```

Доступні імена подій визначені у `src/lib/analytics.ts` (тип `EventName`). Якщо Plausible не налаштований, виклики `trackEvent` безпечно ігноруються.

## Моніторинг помилок — Sentry

Сайт інтегровано з [Sentry](https://sentry.io) через `@sentry/nextjs` для збору помилок із сервера, edge-рантайму та браузера.

### Увімкнення

1. Створіть обліковий запис на sentry.io та проєкт типу **Next.js**.
2. Скопіюйте DSN із налаштувань проєкту Sentry.
3. Задайте змінні середовища у продакшен-оточенні (Vercel / Docker / VPS):

   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://<key>@o<org>.ingest.sentry.io/<project>
   SENTRY_DSN=https://<key>@o<org>.ingest.sentry.io/<project>
   ```

4. Для завантаження source maps під час збірки додатково задайте:

   ```env
   SENTRY_ORG=<your-org-slug>
   SENTRY_PROJECT=<your-project-slug>
   SENTRY_AUTH_TOKEN=<token з sentry.io/settings/account/api/auth-tokens/>
   ```

### Поведінка

- **Умовна ініціалізація.** Якщо `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN` не задані, SDK не ініціалізується, а `withSentryConfig` працює як no-op — збірка й деплой проходять без помилок.
- **Тільки продакшен.** У `sentry.{server,client,edge}.config.ts` встановлено `enabled: process.env.NODE_ENV === 'production'`, тому в `npm run dev` помилки не надсилаються.
- **Сервер + edge.** `instrumentation.ts` підключає `sentry.server.config.ts` для Node-рантайму та `sentry.edge.config.ts` для edge-рантайму (middleware, edge routes).
- **Клієнт.** `sentry.client.config.ts` ініціалізує браузерний SDK і автоматично ловить необроблені помилки та unhandled rejections.
- **Source maps.** Вивантажуються лише коли задані `SENTRY_ORG`, `SENTRY_PROJECT` і `SENTRY_AUTH_TOKEN` на момент `npm run build`. Ввімкнено `hideSourceMaps: true`, щоб мапи не публікувалися публічно.
- **Tunnel.** Запити SDK проксіюються через `/monitoring`, що допомагає обходити ad-blockers.

### Локальна перевірка

```bash
SENTRY_DSN=... NEXT_PUBLIC_SENTRY_DSN=... NODE_ENV=production npm run build
```

Без цих змінних просто виконайте `npm run build` — збірка має завершитися успішно.

