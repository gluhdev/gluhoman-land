# План: Повноцінна CRM-система Глухомань

## Контекст і обсяг

Потрібна єдина система для управління:
1. **Меню та замовлення доставки** (з кошиком, LiqPay)
2. **Бронювання готелю** (номери, дати, оплата)
3. **Продаж квитків в аквапарк** (дати, кількість, тарифи)
4. **Резервація лазні** (час, послуги, передоплата)

Це **6-8 тижнів роботи** для повної системи. Ділимо на фази, щоб ти отримував робочу цінність кожні 1-2 тижні.

---

## Технологічний стек

| Що | Чим | Чому |
|---|---|---|
| **Фреймворк** | Next.js 15 (вже є) | App Router, RSC, API routes |
| **БД** | PostgreSQL (Supabase або Neon) | Безкоштовний tier, легкий старт |
| **ORM** | Prisma | Типобезпека, міграції, удобство |
| **Auth (admin)** | NextAuth.js v5 (Auth.js) | Готовий, гнучкий, працює з App Router |
| **Платежі** | LiqPay → Monobank Acquiring | Як просив |
| **Email сповіщення** | Resend (3000/міс безкоштовно) | Підтвердження замовлень |
| **Стан кошика (frontend)** | Zustand + persist | Простий, без бойлерплейту |
| **Форми** | react-hook-form + zod | Валідація, типи |
| **Адмінка UI** | shadcn/ui (вже є) + tanstack table | Швидко і красиво |
| **Деплой** | Vercel або self-host (вже є standalone build) | На вибір |

---

## ENV-змінні (потрібні від тебе)

```env
# База
DATABASE_URL=postgres://...

# Admin auth
NEXTAUTH_URL=https://gluhoman.com.ua
NEXTAUTH_SECRET=<openssl rand -base64 32>
ADMIN_EMAIL=<твій email>
ADMIN_PASSWORD_HASH=<bcrypt hash>

# LiqPay
LIQPAY_PUBLIC_KEY=<з кабінету>
LIQPAY_PRIVATE_KEY=<з кабінету>

# Email
RESEND_API_KEY=<з resend.com>
NOTIFICATION_EMAIL=<куди приходять замовлення>
```

---

## Архітектура баз даних (Prisma schema)

```prisma
// Користувач (для admin login)
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      String   @default("admin")
  createdAt DateTime @default(now())
}

// ─── МЕНЮ ───
// Меню імпортується з src/data/menu.json через сід.
// Категорії і страви тримаємо в БД для CRUD з адмінки.
model MenuCategory {
  id        String     @id @default(cuid())
  slug      String     @unique
  name      String
  icon      String?
  order     Int        @default(0)
  active    Boolean    @default(true)
  items     MenuItem[]
}

model MenuItem {
  id          String        @id @default(cuid())
  slug        String        @unique
  name        String
  description String?
  price       Int           // в копійках
  weight      String?
  image       String?
  active      Boolean       @default(true)
  category    MenuCategory  @relation(fields: [categoryId], references: [id])
  categoryId  String
  orderItems  OrderItem[]
}

// ─── ЗАМОВЛЕННЯ ДОСТАВКИ ───
model Order {
  id            String      @id @default(cuid())
  number        Int         @unique @default(autoincrement())  // людський номер
  status        OrderStatus @default(PENDING)
  // Клієнт
  customerName  String
  customerPhone String
  // Доставка
  deliveryType  String      // "delivery" | "pickup"
  address       String?
  scheduledAt   DateTime?   // якщо на час
  comment       String?
  // Гроші (всі в копійках)
  subtotal      Int
  deliveryFee   Int
  total         Int
  // Платіж
  payment       Payment?
  paymentStatus String      @default("pending") // pending | paid | failed
  // Items
  items         OrderItem[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum OrderStatus {
  PENDING       // нове, не сплачене
  PAID          // сплачене
  CONFIRMED     // підтверджене кухнею
  PREPARING     // готується
  DELIVERING    // в дорозі
  COMPLETED     // виконане
  CANCELLED
}

model OrderItem {
  id        String   @id @default(cuid())
  order     Order    @relation(fields: [orderId], references: [id])
  orderId   String
  menuItem  MenuItem @relation(fields: [menuItemId], references: [id])
  menuItemId String
  // Snapshot на момент замовлення (на випадок зміни ціни/назви)
  name      String
  price     Int
  quantity  Int
}

// ─── БРОНЮВАННЯ ГОТЕЛЮ ───
model HotelRoom {
  id          String   @id @default(cuid())
  number      String   @unique
  type        String   // "standard" | "lux" | "family"
  capacity    Int
  pricePerNight Int    // копійок
  description String?
  images      String[]
  active      Boolean  @default(true)
  bookings    HotelBooking[]
}

model HotelBooking {
  id            String   @id @default(cuid())
  number        Int      @unique @default(autoincrement())
  room          HotelRoom @relation(fields: [roomId], references: [id])
  roomId        String
  customerName  String
  customerPhone String
  customerEmail String?
  checkIn       DateTime
  checkOut      DateTime
  guests        Int
  total         Int
  status        String   @default("pending") // pending|paid|confirmed|completed|cancelled
  paymentStatus String   @default("pending")
  payment       Payment?
  comment       String?
  createdAt     DateTime @default(now())
}

// ─── АКВАПАРК ───
model AquaparkTariff {
  id          String   @id @default(cuid())
  name        String   // "Дорослий", "Дитячий", "Сімейний"
  price       Int
  description String?
  active      Boolean  @default(true)
}

model AquaparkTicket {
  id            String   @id @default(cuid())
  number        Int      @unique @default(autoincrement())
  date          DateTime
  customerName  String
  customerPhone String
  items         Json     // [{ tariffId, quantity, price }]
  total         Int
  status        String   @default("pending")
  paymentStatus String   @default("pending")
  payment       Payment?
  qrCode        String?  // для перевірки на вході
  createdAt     DateTime @default(now())
}

// ─── ЛАЗНЯ ───
model SaunaSlot {
  id            String   @id @default(cuid())
  date          DateTime
  startTime     String   // "18:00"
  endTime       String   // "20:00"
  saunaType     String   // "small" | "big"
  customerName  String?
  customerPhone String?
  status        String   @default("free") // free|reserved|paid|completed
  total         Int?
  payment       Payment?
  createdAt     DateTime @default(now())
}

// ─── СПІЛЬНЕ ───
model Payment {
  id            String   @id @default(cuid())
  provider      String   // "liqpay" | "monobank"
  externalId    String?  @unique
  status        String   // pending|success|failure|refund
  amount        Int
  currency      String   @default("UAH")
  payload       Json?    // raw response
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Polymorphic: один з цих
  orderId          String? @unique
  order            Order? @relation(fields: [orderId], references: [id])
  hotelBookingId   String? @unique
  hotelBooking     HotelBooking? @relation(fields: [hotelBookingId], references: [id])
  aquaparkTicketId String? @unique
  aquaparkTicket   AquaparkTicket? @relation(fields: [aquaparkTicketId], references: [id])
  saunaSlotId      String? @unique
  saunaSlot        SaunaSlot? @relation(fields: [saunaSlotId], references: [id])
}
```

---

## Фази впровадження

### **PHASE 1 — Cart MVP + Menu Order + LiqPay** ⏱ 3-5 днів
**Що отримає клієнт:** працююче замовлення доставки з оплатою.

#### Backend
- Prisma schema (тільки User, MenuCategory, MenuItem, Order, OrderItem, Payment)
- Сід: завантажити `src/data/menu.json` в БД
- API routes:
  - `POST /api/orders` — створити замовлення, повернути id
  - `POST /api/payment/liqpay/create` — згенерувати дані для віджету (server signature)
  - `POST /api/payment/liqpay/callback` — обробити callback від LiqPay (verify signature, update status)
  - `GET /api/orders/[id]/status` — для polling зі сторінки success
- Resend integration: лист менеджеру при кожному замовленні

#### Frontend
- `src/lib/cart-store.ts` — Zustand store з persist
- Кнопки **"+ В кошик"** на `DishCard` і `DishListItem`
- `src/components/menu/CartDrawer.tsx` — slide-in справа панель:
  - Список товарів з qty controls
  - Підсумок: subtotal, delivery, total
  - Кнопка "Оформити замовлення"
- `src/components/menu/CartButton.tsx` — floating нижній правий кут (badge з count)
- `src/app/menu/checkout/page.tsx` — checkout форма:
  - Ім'я, телефон (валідація: `+380XX XXX XX XX`)
  - Тип: доставка / самовивіз
  - Адреса (якщо доставка)
  - Час: зараз / на конкретний час
  - Коментар
  - **Підсумок**:
    - Сума
    - Доставка: 100 грн якщо `<2000`, 0 якщо `≥2000`
    - **Мінімальне замовлення 500 грн** — кнопка disabled якщо менше
  - Кнопка "Сплатити через LiqPay" → редірект на LiqPay віджет
- `src/app/menu/checkout/success/page.tsx` — успішна оплата + номер замовлення
- `src/app/menu/checkout/fail/page.tsx` — помилка

#### Cart logic
```ts
// src/lib/cart-store.ts
interface CartState {
  items: { menuItemId: string; name: string; price: number; image?: string; quantity: number }[];
  add: (item) => void;
  remove: (id) => void;
  setQty: (id, qty) => void;
  clear: () => void;
  subtotal: () => number;
  deliveryFee: (subtotal) => number;
  total: () => number;
  isAboveMinimum: () => boolean;
}

const MIN_ORDER = 50000; // 500 грн in копійках
const DELIVERY_FEE = 10000; // 100 грн
const FREE_DELIVERY_FROM = 200000; // 2000 грн
```

**Deliverables Phase 1:**
- ✅ Робочий кошик
- ✅ Замовлення зберігаються в БД
- ✅ Оплата через LiqPay
- ✅ Email менеджеру при новому замовленні
- ✅ Сторінка success/fail
- ❌ Адмінки ще немає (Phase 2)

---

### **PHASE 2 — Admin Panel (мінімум для перегляду замовлень)** ⏱ 3-4 дні
- NextAuth.js setup (Credentials provider, ADMIN_EMAIL/PASSWORD_HASH)
- `/admin` route з auth middleware
- `/admin/orders` — список усіх замовлень з фільтрами (статус, дата)
- `/admin/orders/[id]` — деталі замовлення + зміна статусу
- `/admin/menu` — CRUD страв і категорій (active/inactive, ціни, фото)
- Базовий dashboard: сума за день, кількість замовлень

---

### **PHASE 3 — Hotel Bookings** ⏱ 4-5 днів
- HotelRoom model + сід
- `/hotel/booking` — публічна форма бронювання (вибір номера, дат, гостей)
- Перевірка зайнятості за датами (uniqueness check)
- LiqPay для предоплати (наприклад 30%)
- `/admin/hotel/bookings` — список + календар
- `/admin/hotel/rooms` — CRUD номерів

---

### **PHASE 4 — Aquapark Tickets** ⏱ 3-4 дні
- AquaparkTariff model + сід
- `/aquapark/buy` — вибір дати, тарифів, кількості
- LiqPay
- QR-код квитка (qrcode npm package)
- Email з QR після оплати
- `/admin/aquapark/tickets` — список, search by QR
- `/admin/aquapark/scan` — простий сканер для входу (mobile-first)

---

### **PHASE 5 — Sauna Reservations** ⏱ 3-4 дні
- SaunaSlot model: фіксована сітка часу (наприклад 10:00-12:00, 12:00-14:00, ..., 22:00-24:00)
- `/sauna/booking` — календар + вільні слоти
- Перевірка зайнятості
- LiqPay предоплата
- `/admin/sauna/calendar` — календарний вигляд

---

### **PHASE 6 — Покращення CRM** ⏱ безперервно
- Звіти і статистика (графіки доходу, популярні страви)
- Експорт у Excel/CSV
- SMS-сповіщення клієнтам (через TurboSMS або подібне)
- Telegram бот для менеджера (новина про замовлення приходить миттєво)
- Програма лояльності (бонуси/знижки)
- Інтеграція з 1С або іншою бухгалтерією

---

## LiqPay інтеграція — як працює

1. Користувач натискає "Сплатити" в checkout
2. Frontend → `POST /api/payment/liqpay/create` з orderId
3. Server:
   - Бере order з БД
   - Формує `data` (base64) і `signature` (sha1) за алгоритмом LiqPay
   - Повертає `{ data, signature }`
4. Frontend редіректить на LiqPay (form POST або їх віджет)
5. Користувач платить
6. LiqPay → `POST /api/payment/liqpay/callback` з `data, signature`
7. Server:
   - Verify signature
   - Decode data
   - Знайти Order по `order_id`
   - Update `paymentStatus = paid`, `status = PAID`
   - Trigger email до менеджера
8. Frontend на сторінці success polling-ом перевіряє статус через `GET /api/orders/[id]/status`

---

## Файлова структура (нова)

```
src/
├── app/
│   ├── api/
│   │   ├── orders/route.ts                    # POST create order
│   │   ├── orders/[id]/status/route.ts        # GET status
│   │   ├── payment/liqpay/create/route.ts     # POST → signed data
│   │   ├── payment/liqpay/callback/route.ts   # POST ← LiqPay
│   │   └── auth/[...nextauth]/route.ts        # Phase 2
│   ├── menu/
│   │   ├── checkout/
│   │   │   ├── page.tsx                       # Phase 1 — checkout form
│   │   │   ├── success/page.tsx               # Phase 1
│   │   │   └── fail/page.tsx                  # Phase 1
│   ├── admin/                                  # Phase 2
│   │   ├── layout.tsx                         # auth check
│   │   ├── page.tsx                           # dashboard
│   │   ├── orders/
│   │   ├── menu/
│   │   ├── hotel/                             # Phase 3
│   │   ├── aquapark/                          # Phase 4
│   │   └── sauna/                             # Phase 5
├── components/
│   ├── menu/
│   │   ├── CartDrawer.tsx                     # Phase 1
│   │   ├── CartButton.tsx                     # Phase 1
│   │   └── (existing)
│   ├── admin/                                  # Phase 2+
├── lib/
│   ├── cart-store.ts                          # Phase 1 (Zustand)
│   ├── liqpay.ts                              # Phase 1 (sign/verify)
│   ├── prisma.ts                              # Phase 1
│   ├── email.ts                               # Phase 1 (Resend)
│   └── auth.ts                                # Phase 2 (NextAuth)
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                                # імпорт menu.json → БД
```

---

## Що мені потрібно ВІД ТЕБЕ для старту Phase 1

1. **БД**: створи безкоштовний акаунт на https://supabase.com/ або https://neon.tech/, створи проект, дай мені `DATABASE_URL` (postgres connection string)
2. **LiqPay**: створи акаунт на https://www.liqpay.ua/, отримай `public_key` і `private_key` з кабінету (Розробники → Акаунти)
3. **Resend** (опційно для Phase 1, можна пізніше): https://resend.com/ → API key
4. **NOTIFICATION_EMAIL**: на яку пошту присилати замовлення менеджеру

Все це додаси в `.env.local` (я підготую `.env.example` шаблон).

---

## Старт

Готовий почати **Phase 1** прямо зараз. Як тільки даси `DATABASE_URL` і LiqPay ключі — реалізую за сесію або дві.

Якщо хочеш почати ще без БД (in-memory або файлова JSON-БД для тестування), можу так — але тоді нічого не зберігатиметься між рестартами і в production не вийде. **Краще одразу з Supabase/Neon — це безкоштовно і 5 хвилин налаштування.**
