# Telegram Bot Setup

## Огляд

Gluhoman CRM включає Telegram-бота для:
- **Продажу бронювань/квитків** через лінки на веб-форми
- **Перегляду статусу замовлень** клієнтами за телефоном
- **Миттєвих сповіщень** про нові замовлення (для менеджера)

**Архітектура:** бот інтегрований у Next.js через webhook — окремий процес не потрібен.

## Налаштування

### 1. Створити бота в BotFather

1. Відкрий [@BotFather](https://t.me/BotFather) у Telegram
2. `/newbot`
3. Введи назву: `Глухомань`
4. Введи username: `gluhoman_bot` (або інший вільний)
5. Скопіюй токен вигляду `7123456789:AAHdqTcvCH1vGWJxfSeo...`

### 2. Додати в `.env.local`

```env
TELEGRAM_BOT_TOKEN=7123456789:AAHdqTcvCH1vGWJxfSeo...

# Опційно: secret для захисту webhook endpoint
TELEGRAM_WEBHOOK_SECRET=your-random-secret

# Для налаштування webhook URL
NEXT_PUBLIC_SITE_URL=https://gluhoman.com.ua
```

Згенерувати secret: `openssl rand -hex 16`

### 3. Перезапустити dev-сервер

```bash
npm run dev
```

### 4. Встановити webhook

**Варіант A — через admin UI:**

Відкрий [/admin/telegram](http://localhost:3000/admin/telegram) і натисни **«Встановити webhook»**.

**Варіант B — через CLI:**

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-domain.com/api/telegram/webhook&secret_token=<SECRET>"
```

⚠️ Для production потрібен **HTTPS URL**. Telegram не приймає HTTP.
Для локального тестування використовуй [ngrok](https://ngrok.com/):

```bash
ngrok http 3000
# → скопіюй https://xxxx.ngrok.io і встав як NEXT_PUBLIC_SITE_URL
```

### 5. Встановити меню команд (опційно)

У @BotFather:
```
/setcommands
# обери бота
# встав:
start - Головне меню
menu - Меню ресторану
hotel - Готель
aquapark - Аквапарк
sauna - Лазня
orders - Мої замовлення
help - Допомога
```

---

## Команди

| Команда | Опис |
|---|---|
| `/start` | Головне меню з кнопками на 4 напрямки |
| `/menu` | Посилання на повне меню ресторану (295 страв) |
| `/hotel` | Список активних номерів + посилання на бронювання |
| `/aquapark` | Активні тарифи + посилання на купівлю |
| `/sauna` | Інформація про часові слоти + посилання на резервацію |
| `/orders` | Після share-contact показує замовлення клієнта |

### Flow замовлення

1. Клієнт → `/start`
2. Натискає кнопку напрямку → бот показує короткий summary + кнопку-посилання
3. Клієнт йде на сайт, заповнює форму, оплачує через LiqPay
4. LiqPay callback → order/booking marked as paid
5. **Notify** — якщо `TELEGRAM_CHAT_ID` налаштовано, менеджеру приходить повідомлення

### Сповіщення менеджеру

Код уже є в `src/lib/order-notify.ts`, `booking-notify.ts`, `aquapark-notify.ts`, `sauna-notify.ts`.

Щоб отримувати повідомлення про нові замовлення у ваш чат:

1. Створи групу/канал і додай туди бота
2. Отримай chat_id (через [@getidsbot](https://t.me/getidsbot) або з webhook payload)
3. Додай у `.env.local`:
   ```env
   TELEGRAM_CHAT_ID=-1001234567890
   ```

---

## Webhook endpoint

```
POST /api/telegram/webhook
```

Якщо заданий `TELEGRAM_WEBHOOK_SECRET`, вимагається header:
```
X-Telegram-Bot-Api-Secret-Token: <SECRET>
```

Telegram автоматично додає цей header якщо secret_token вказаний при `setWebhook`.

---

## Admin API

- `GET /api/admin/telegram/info` — info про бота + статус webhook
- `POST /api/admin/telegram/set-webhook` — `{ action: 'set' | 'delete', url? }`

Обидва auth-protected (потребують адмінської сесії).

---

## Conversation state

MVP зберігає phone-cache у **in-memory `Map`** (per chatId, per server process).
При рестарті сервера — очищається. Клієнт просто ще раз поділиться контактом.

**Для production multi-instance:** переключити на Redis або DB.

---

## Наступні кроки (не реалізовано в MVP)

- **In-chat booking flows** — вся конверсія в Telegram без виходу на сайт
- **Native Telegram Payments** (`sendInvoice` + Payme/Stripe провайдер)
- **Notification preferences** — клієнт сам підписується на оновлення свого замовлення
- **Broadcast messages** — масова розсилка промо/новин підписникам
- **Loyalty program** — бонусні бали відображаються в профілі бота
