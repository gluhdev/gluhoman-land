# Тестування (Playwright E2E)

Цей документ описує, як запускати та підтримувати end-to-end тести для сайту Глухомань.

## Перший запуск

```bash
npx playwright install chromium
```

## Запуск тестів

```bash
# Усі тести (headless)
npm run test:e2e

# Інтерактивний UI режим
npm run test:e2e:ui

# Один файл
npx playwright test e2e/smoke.spec.ts

# Лише chromium проект
npx playwright test --project=chromium

# Debug режим (крок за кроком)
npx playwright test --debug

# З детальним репортером
npx playwright test --reporter=list
```

Playwright автоматично піднімає dev-сервер на порту 3002 (див. `playwright.config.ts`).
Якщо сервер уже запущено — він перевикористається локально.

## Тестування проти staging/production

```bash
TEST_BASE_URL=https://staging.gluhoman.com.ua npx playwright test
```

Коли задано `TEST_BASE_URL`, Playwright не піднімає локальний webServer.

## Структура

- `e2e/smoke.spec.ts` — 10 основних smoke-тестів (лендінг, сервіси, меню, галерея, футер)
- `e2e/booking-dialog.spec.ts` — тести преміум діалогу бронювання
- `e2e/admin-auth.spec.ts` — авторизація адмінки (seed user: `admin@gluhoman.local` / `admin123`)

## CI інтеграція

Встановіть `CI=1` для ретраїв та `forbid.only`:

```yaml
- run: npx playwright install --with-deps chromium
- run: CI=1 npm run test:e2e
```

Артефакти: `playwright-report/` (HTML звіт) та `test-results/` (traces, скріншоти) — обидва в `.gitignore`.

## Відомі нестабільні / skip-тести

Деякі тести використовують `test.skip(...)` коли реальна UI структура відрізняється від очікуваної:

- **booking-dialog → hotel calendar range** — skip якщо кнопки дат мають нестандартний формат (не просто число). Потрібно додати `data-testid="calendar-day"` у `BookingDialog`.
- **booking-dialog → step transition** — skip якщо діалог однокроковий. Додайте `data-testid="booking-next"` щоб стабілізувати.
- **booking-dialog → validation** — м'яка перевірка (дилог залишається відкритим). Покращити: додати `role="alert"` для помилок.
- **admin-auth → logout** — шукає кнопку/лінк Вийти, інакше падає на `/admin/logout`. Бажано додати `data-testid="admin-logout"`.

Якщо якийсь тест падає через справжній баг у джерелі — НЕ правимо джерело в рамках тестування, фіксуємо тут і створюємо окремий issue.

## Поради

- Не використовуйте `page.waitForTimeout(...)` понад 1 сек — тільки `toBeVisible` / `waitForURL` / `waitForLoadState`.
- Українські рядки → `page.getByText(/Забронювати/i)`.
- Для стабільності додавайте `data-testid` у ключових місцях (діалог, календар, кнопки admin).
