# Gluhoman Telegram Bot

Окремий Telegram-бот для адміністраторів рекреаційного комплексу «Глухомань».
Запускається як самостійний Node.js процес у власному Docker-контейнері поряд
з основним Next.js сайтом (на одному VPS через docker-compose).

## Що вміє

Для всіх користувачів:
- `/start` — привітання та короткий опис бота
- `/help` — список команд
- Будь-яке текстове повідомлення — автовідповідь з контактами

Для адміністраторів (за `chat_id`):
- `/bookings` — останні 10 бронювань
- `/booking <id>` — повні деталі бронювання за префіксом ID
- `/stats` — загальна кількість + розбивка за послугами

## Змінні середовища

| Назва | Опис |
|---|---|
| `BOT_TOKEN` | Токен від @BotFather |
| `ADMIN_CHAT_IDS` | Список chat_id адмінів через кому, напр. `12345,67890` |
| `DATABASE_URL` | Рядок підключення до БД (той самий, що й у головного застосунку) |

## Локальний запуск

```bash
cd bot
npm install

# Спільна Prisma-схема з основного застосунку
npx prisma generate --schema=../prisma/schema.prisma

export BOT_TOKEN=xxx
export ADMIN_CHAT_IDS=12345
export DATABASE_URL="file:../prisma/dev.db"

npm run dev
```

## Продакшн (docker-compose)

Бот збирається з Dockerfile у `bot/Dockerfile`, **контекст збірки — корінь
проєкту** (не `./bot`), бо нам потрібно скопіювати спільну директорію
`prisma/` з головного застосунку в контейнер.

Приклад сервісу в `docker-compose.yml` (у корені проєкту):

```yaml
services:
  bot:
    build:
      context: .
      dockerfile: bot/Dockerfile
    environment:
      BOT_TOKEN: ${BOT_TOKEN}
      ADMIN_CHAT_IDS: ${ADMIN_CHAT_IDS}
      DATABASE_URL: ${DATABASE_URL}
    volumes:
      # Щоб бот бачив ту саму SQLite-базу/Prisma-схему, що й основний застосунок
      - ./prisma:/app/prisma
    restart: unless-stopped
```

## Спільна Prisma-схема

Бот **не має власної схеми**. Він використовує ту саму `prisma/schema.prisma`,
що й основний Next.js сайт:

- **Локально:** `npx prisma generate --schema=../prisma/schema.prisma`
- **У Docker:** директорія `prisma/` копіюється в контейнер під час збірки
  (з кореня репозиторію — тому `context: .` у compose), а в рантаймі може
  монтуватись як volume, щоб бот і сайт бачили одну й ту саму базу даних.

> ⚠️ Якщо поля моделі `Booking` у схемі відрізняються від тих, що використовує
> `src/lib/format.ts` / `src/handlers/bookings.ts`, потрібно оновити
> `BookingLike` в `format.ts` та відповідні запити.

## Архітектура

```
bot/
├── Dockerfile
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # Точка входу, реєстрація команд
    ├── handlers/
    │   ├── start.ts
    │   ├── help.ts
    │   └── bookings.ts       # /bookings, /booking, /stats
    └── lib/
        ├── db.ts             # PrismaClient
        └── format.ts         # Форматування повідомлень
```

Бібліотеки:
- [`telegraf`](https://telegraf.js.org/) v4 — Telegram Bot framework
- [`@prisma/client`](https://www.prisma.io/) — доступ до БД
