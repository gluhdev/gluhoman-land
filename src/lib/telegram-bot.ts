/**
 * Gluhoman Telegram bot — command dispatcher and handlers.
 *
 * MVP scope: bot is a "launcher" into the web flows.
 *   /start              → welcome + 4 direction buttons
 *   /menu               → link to /menu
 *   /hotel              → link to /hotel/booking + summary
 *   /aquapark           → link to /aquapark/buy + summary
 *   /sauna              → link to /sauna/booking + summary
 *   /orders             → if user shared phone, show recent orders across modules
 *   Phone contact       → save + show orders
 *   Any other message   → fallback help
 *
 * Conversation state:
 *   Tracks a simple per-chat phone cache in memory (Map).
 *   In production, this should be in Redis / DB, but for MVP it's enough —
 *   phone is re-sent via Telegram's native "Share Contact" button every
 *   /orders if memory has been cleared.
 */

import {
  TelegramUpdate,
  CallbackQuery,
  TelegramMessage,
  ReplyKeyboardMarkup,
  sendMessage,
  answerCallbackQuery,
  editMessageText,
} from '@/lib/telegram';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';
import {
  changeStatus,
  actionToStatus,
  type StatusAction,
} from '@/lib/status-service';
import { buildActionKeyboard } from '@/lib/status-notify';
import type { PaymentType } from '@/lib/payment-router';
import { createBookingCore } from '@/lib/booking-create';
import { getHotelRooms, type BookingHotelSlug } from '@/lib/hotel-rooms';

// In-memory phone cache (per chatId) — ephemeral, resets on server restart
const phoneCache = new Map<number, string>();

/* ─── Admin authorization (operators who may manage from Telegram) ─── */

/** Allowlist of Telegram user ids permitted to run admin actions. Default
 *  CLOSED — an empty/unset TELEGRAM_ADMIN_CHAT_IDS means nobody can manage. */
function isAdminChat(id?: number): boolean {
  if (id == null) return false;
  const ids = (process.env.TELEGRAM_ADMIN_CHAT_IDS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return ids.includes(String(id));
}

const ADMIN_ACTIONS = [
  'confirm',
  'cancel',
  'preparing',
  'delivering',
  'complete',
  'refund',
];
const ADMIN_ENTITIES = ['order', 'reservation', 'hotel', 'sauna', 'aquapark'];

/** Parse an admin action callback "action:entity:id" (or null if not one). */
function parseAdminCallback(
  data: string,
): { action: StatusAction; entity: PaymentType; id: string } | null {
  const idx1 = data.indexOf(':');
  const idx2 = data.indexOf(':', idx1 + 1);
  if (idx1 === -1 || idx2 === -1) return null;
  const action = data.slice(0, idx1);
  const entity = data.slice(idx1 + 1, idx2);
  const id = data.slice(idx2 + 1);
  if (!ADMIN_ACTIONS.includes(action) || !ADMIN_ENTITIES.includes(entity) || !id)
    return null;
  return {
    action: action as StatusAction,
    entity: entity as PaymentType,
    id,
  };
}

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}

/* ─── Keyboards ─── */

/**
 * Persistent reply keyboard — stays at the bottom of the chat.
 * Shown on /start and after returning to the main menu. User taps a button =
 * sends the corresponding text which our message handler maps back to commands.
 */
function mainReplyKeyboard(): ReplyKeyboardMarkup {
  return {
    keyboard: [
      [{ text: '🍽 Меню' }, { text: '🏨 Готель' }],
      [{ text: '🌊 Аквапарк' }, { text: '🔥 Лазня' }],
      [{ text: '📋 Мої замовлення' }, { text: 'ℹ️ Допомога' }],
    ],
    resize_keyboard: true,
    is_persistent: true,
  };
}

function phoneRequestKeyboard(): ReplyKeyboardMarkup {
  return {
    keyboard: [
      [{ text: '📱 Поділитися номером', request_contact: true }],
      [{ text: '⬅️ Головне меню' }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  };
}

/**
 * Maps reply-keyboard button labels to command names.
 * Keeps command handling in one place.
 */
const REPLY_BUTTON_COMMANDS: Record<string, string> = {
  '🍽 Меню': '/menu',
  '🏨 Готель': '/hotel',
  '🌊 Аквапарк': '/aquapark',
  '🔥 Лазня': '/sauna',
  '📋 Мої замовлення': '/orders',
  'ℹ️ Допомога': '/help',
  '⬅️ Головне меню': '/start',
};

/* ─── Handlers ─── */

async function handleStart(chatId: number, userName?: string): Promise<void> {
  const greeting = userName ? `Вітаємо, ${userName}! 👋` : 'Вітаємо! 👋';
  const text =
    `${greeting}\n\n` +
    `<b>Глухомань</b> — рекреаційний комплекс у с. Нижні Млини, Полтавська область.\n\n` +
    `Через цей бот ви можете:\n` +
    `• Переглянути меню ресторану\n` +
    `• Забронювати номер у готелі\n` +
    `• Купити квитки в аквапарк\n` +
    `• Зарезервувати лазню\n` +
    `• Перевірити статус ваших замовлень\n\n` +
    `Оберіть напрямок на клавіатурі нижче ⬇️`;

  // Send persistent reply keyboard — buttons stay at the bottom of the chat
  await sendMessage({
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: mainReplyKeyboard(),
  });
}

async function handleMenuFlow(chatId: number): Promise<void> {
  const url = `${getSiteUrl()}/menu`;
  const text =
    `🍽 <b>Меню ресторану «Глухомань»</b>\n\n` +
    `У нашому меню <b>295 страв</b> у 48 категоріях — українська та європейська кухня, ` +
    `крафтове пиво власного виробництва.\n\n` +
    `Натисніть кнопку нижче, щоб переглянути повне меню і замовити доставку.`;

  await sendMessage({
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🍽 Відкрити меню', url }],
        [{ text: '⬅️ Головне меню', callback_data: 'flow:start' }],
      ],
    },
  });
}

async function handleHotelFlow(chatId: number): Promise<void> {
  // Fetch rooms to show in summary
  const rooms = await prisma.hotelRoom.findMany({
    where: { active: true },
    orderBy: { pricePerNight: 'asc' },
  });
  const url = `${getSiteUrl()}/hotel/booking`;

  let text = `🏨 <b>Готель «Глухомань»</b>\n\nДоступні номери:\n\n`;
  for (const r of rooms) {
    text += `• <b>№${r.number}</b> — ${r.type} (до ${r.capacity} осіб)\n  <i>${formatPrice(r.pricePerNight)}/ніч</i>\n`;
  }
  text += `\nНатисніть кнопку щоб забронювати:`;

  await sendMessage({
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🏨 Забронювати номер', url }],
        [{ text: '⬅️ Головне меню', callback_data: 'flow:start' }],
      ],
    },
  });
}

async function handleAquaparkFlow(chatId: number): Promise<void> {
  const tariffs = await prisma.aquaparkTariff.findMany({
    where: { active: true },
    orderBy: { price: 'asc' },
  });
  const url = `${getSiteUrl()}/aquapark/buy`;

  let text = `🌊 <b>Аквапарк «Глухомань»</b>\n\nНаші тарифи:\n\n`;
  for (const t of tariffs) {
    text += `• <b>${t.name}</b> — ${formatPrice(t.price)}\n`;
    if (t.description) text += `  <i>${t.description}</i>\n`;
  }
  text += `\nПісля оплати ви отримаєте QR-код квитка.`;

  await sendMessage({
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🌊 Купити квитки', url }],
        [{ text: '⬅️ Головне меню', callback_data: 'flow:start' }],
      ],
    },
  });
}

async function handleSaunaFlow(chatId: number): Promise<void> {
  const url = `${getSiteUrl()}/sauna/booking`;
  const text =
    `🔥 <b>Лазня «Глухомань»</b>\n\n` +
    `• Мала лазня — 1 800 ₴ / 2 години\n` +
    `• Велика лазня — 1 800 ₴ / 2 години\n\n` +
    `Доступні часові вікна: 10:00, 12:00, 14:00, 16:00, 18:00, 20:00, 22:00\n\n` +
    `Натисніть кнопку, щоб обрати дату і час:`;

  await sendMessage({
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔥 Забронювати лазню', url }],
        [{ text: '⬅️ Головне меню', callback_data: 'flow:start' }],
      ],
    },
  });
}

async function handleOrdersFlow(chatId: number): Promise<void> {
  const phone = phoneCache.get(chatId);
  if (!phone) {
    await sendMessage({
      chat_id: chatId,
      text:
        `📋 <b>Ваші замовлення</b>\n\n` +
        `Щоб показати ваші замовлення, поділіться вашим номером телефону. ` +
        `Ми шукатимемо замовлення за цим номером.`,
      parse_mode: 'HTML',
      reply_markup: phoneRequestKeyboard(),
    });
    return;
  }
  await showOrdersForPhone(chatId, phone);
}

async function showOrdersForPhone(chatId: number, phone: string): Promise<void> {
  // Normalize phone (strip spaces, dashes, brackets)
  const normalized = phone.replace(/[\s\-()]/g, '');

  const [orders, bookings, tickets, slots] = await Promise.all([
    prisma.order.findMany({
      where: { customerPhone: { contains: normalized.slice(-9) } }, // last 9 digits
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.hotelBooking.findMany({
      where: { customerPhone: { contains: normalized.slice(-9) } },
      include: { room: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.aquaparkTicket.findMany({
      where: { customerPhone: { contains: normalized.slice(-9) } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.saunaSlot.findMany({
      where: { customerPhone: { contains: normalized.slice(-9) } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const totalFound = orders.length + bookings.length + tickets.length + slots.length;

  if (totalFound === 0) {
    await sendMessage({
      chat_id: chatId,
      text:
        `📋 <b>Замовлень не знайдено</b>\n\n` +
        `За номером ${phone} ми не знайшли жодних замовлень. ` +
        `Можливо ви ще нічого не замовляли або номер вказали інший при замовленні.`,
      parse_mode: 'HTML',
      reply_markup: mainReplyKeyboard(),
    });
    return;
  }

  let text = `📋 <b>Ваші замовлення</b>\n<i>Пошук за ${phone}</i>\n\n`;

  if (orders.length > 0) {
    text += `<b>🍽 Замовлення з ресторану</b>\n`;
    for (const o of orders) {
      const date = o.createdAt.toLocaleDateString('uk-UA', { dateStyle: 'short' });
      text += `• №${o.number} — ${formatPrice(o.total)} — <i>${statusLabel(o.status)}</i> (${date})\n`;
    }
    text += '\n';
  }
  if (bookings.length > 0) {
    text += `<b>🏨 Бронювання готелю</b>\n`;
    for (const b of bookings) {
      const ci = b.checkIn.toLocaleDateString('uk-UA', { dateStyle: 'short' });
      const co = b.checkOut.toLocaleDateString('uk-UA', { dateStyle: 'short' });
      text += `• №${b.number} — Номер ${b.room?.number ?? '—'} — ${ci} → ${co} — <i>${statusLabel(b.status)}</i>\n`;
    }
    text += '\n';
  }
  if (tickets.length > 0) {
    text += `<b>🌊 Квитки аквапарку</b>\n`;
    for (const t of tickets) {
      const d = t.date.toLocaleDateString('uk-UA', { dateStyle: 'short' });
      text += `• №${t.number} — ${formatPrice(t.total)} — ${d} — <i>${statusLabel(t.status)}</i>\n`;
    }
    text += '\n';
  }
  if (slots.length > 0) {
    text += `<b>🔥 Бронювання лазні</b>\n`;
    for (const s of slots) {
      const d = s.date.toLocaleDateString('uk-UA', { dateStyle: 'short' });
      text += `• №${s.number} — ${d} ${s.startTime} — <i>${statusLabel(s.status)}</i>\n`;
    }
  }

  await sendMessage({
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: mainReplyKeyboard(),
  });
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'очікує оплати',
    PAID: 'сплачено',
    CONFIRMED: 'підтверджено',
    PREPARING: 'готується',
    DELIVERING: 'в дорозі',
    COMPLETED: 'виконано',
    CANCELLED: 'скасовано',
    pending: 'очікує оплати',
    paid: 'сплачено',
    confirmed: 'підтверджено',
    completed: 'виконано',
    cancelled: 'скасовано',
    used: 'використано',
    reserved: 'зарезервовано',
  };
  return labels[status] ?? status;
}

async function handleContact(
  chatId: number,
  contact: { phone_number: string; first_name: string }
): Promise<void> {
  // Normalize and cache
  let phone = contact.phone_number;
  if (!phone.startsWith('+')) phone = `+${phone}`;
  phoneCache.set(chatId, phone);

  // Send the thank-you WITH the main reply keyboard (restores it after the
  // contact-request keyboard was shown).
  await sendMessage({
    chat_id: chatId,
    text: `✓ Дякуємо! Шукаємо замовлення за ${phone}…`,
    parse_mode: 'HTML',
    reply_markup: mainReplyKeyboard(),
  });

  await showOrdersForPhone(chatId, phone);
}

/** Admin-only: list items awaiting action, each with confirm/cancel buttons. */
async function handlePending(chatId: number): Promise<void> {
  if (!isAdminChat(chatId)) {
    await sendMessage({ chat_id: chatId, text: 'Немає доступу.' });
    return;
  }
  const [bookings, orders] = await Promise.all([
    prisma.booking.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.order.findMany({
      where: { status: { in: ['PENDING', 'PAID'] } },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
  ]);

  if (bookings.length === 0 && orders.length === 0) {
    await sendMessage({
      chat_id: chatId,
      text: '✅ Немає заявок, що очікують дії.',
    });
    return;
  }

  await sendMessage({
    chat_id: chatId,
    text: `📋 <b>Очікують дії</b>: ${bookings.length} бронювань, ${orders.length} замовлень`,
    parse_mode: 'HTML',
  });

  for (const b of bookings) {
    const dates = `${b.dateFrom.toISOString().slice(0, 10)}${b.dateTo ? ' → ' + b.dateTo.toISOString().slice(0, 10) : ''}`;
    await sendMessage({
      chat_id: chatId,
      text: `🏨 <b>Бронювання #${b.id.slice(0, 8)}</b>\n${b.name} · ${b.phone}\n${dates} · <i>${statusLabel(b.status)}</i>`,
      parse_mode: 'HTML',
      reply_markup: buildActionKeyboard('reservation', b.id),
    });
  }
  for (const o of orders) {
    await sendMessage({
      chat_id: chatId,
      text: `🍽 <b>Замовлення №${o.number}</b> — ${formatPrice(o.total)}\n${o.customerName} · ${o.customerPhone} · <i>${statusLabel(o.status)}</i>`,
      parse_mode: 'HTML',
      reply_markup: buildActionKeyboard('order', o.id),
    });
  }
}

/* ─── Admin /book — create a booking conversationally ─── */

type BookStep =
  | 'hotel'
  | 'room'
  | 'dateFrom'
  | 'dateTo'
  | 'guests'
  | 'name'
  | 'phone'
  | 'confirm';

interface BookDraft {
  step: BookStep;
  hotelSlug?: BookingHotelSlug;
  roomCategorySlug?: string;
  roomLabel?: string;
  dateFrom?: string;
  dateTo?: string;
  guests?: number;
  name?: string;
  phone?: string;
  expiresAt: number;
}

const bookDrafts = new Map<number, BookDraft>();
const BOOK_TTL_MS = 15 * 60 * 1000;

const HOTEL_LABELS: Record<BookingHotelSlug, string> = {
  aquapark: 'Готель-Аквапарк',
  central: 'Центральний',
  brewery: 'Броварня',
  cottages: 'Будиночки',
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function getDraft(chatId: number): BookDraft | undefined {
  const d = bookDrafts.get(chatId);
  if (!d) return undefined;
  if (Date.now() > d.expiresAt) {
    bookDrafts.delete(chatId);
    return undefined;
  }
  return d;
}

async function startBook(chatId: number): Promise<void> {
  if (!isAdminChat(chatId)) {
    await sendMessage({ chat_id: chatId, text: 'Немає доступу.' });
    return;
  }
  bookDrafts.set(chatId, { step: 'hotel', expiresAt: Date.now() + BOOK_TTL_MS });
  await sendMessage({
    chat_id: chatId,
    text: '🆕 <b>Нове бронювання</b>\n\nКрок 1/6 — оберіть готель:',
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: (Object.keys(HOTEL_LABELS) as BookingHotelSlug[]).map(
        (slug) => [{ text: HOTEL_LABELS[slug], callback_data: `book:hotel:${slug}` }],
      ).concat([[{ text: '✖️ Скасувати', callback_data: 'book:cancel' }]]),
    },
  });
}

/** Handle the inline-button steps of /book (book:hotel / book:room / confirm / cancel). */
async function handleBookCallback(query: CallbackQuery, rest: string): Promise<void> {
  const chatId = query.message?.chat.id;
  if (!chatId) return;
  await answerCallbackQuery({ callback_query_id: query.id });
  if (!isAdminChat(query.from.id)) return;

  if (rest === 'cancel') {
    bookDrafts.delete(chatId);
    await sendMessage({ chat_id: chatId, text: '✖️ Створення бронювання скасовано.' });
    return;
  }

  const draft = getDraft(chatId);
  if (!draft) {
    await sendMessage({ chat_id: chatId, text: 'Сесію завершено. Почніть знову: /book' });
    return;
  }

  if (rest.startsWith('hotel:')) {
    const slug = rest.slice('hotel:'.length) as BookingHotelSlug;
    if (!HOTEL_LABELS[slug]) return;
    draft.hotelSlug = slug;
    draft.step = 'room';
    draft.expiresAt = Date.now() + BOOK_TTL_MS;
    const rooms = await getHotelRooms(slug, 'uk');
    await sendMessage({
      chat_id: chatId,
      text: `Крок 2/6 — оберіть номер у «${HOTEL_LABELS[slug]}»:`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: rooms
          .slice(0, 10)
          .map((r) => [{ text: r.name, callback_data: `book:room:${r.slug}` }])
          .concat([[{ text: '✖️ Скасувати', callback_data: 'book:cancel' }]]),
      },
    });
    return;
  }

  if (rest.startsWith('room:')) {
    const slug = rest.slice('room:'.length);
    draft.roomCategorySlug = slug;
    draft.step = 'dateFrom';
    draft.expiresAt = Date.now() + BOOK_TTL_MS;
    await sendMessage({
      chat_id: chatId,
      text: 'Крок 3/6 — дата заїзду у форматі <b>РРРР-ММ-ДД</b> (напр. 2026-07-15):',
      parse_mode: 'HTML',
    });
    return;
  }

  if (rest === 'confirm') {
    if (draft.step !== 'confirm' || !draft.hotelSlug || !draft.roomCategorySlug) return;
    const result = await createBookingCore(
      {
        hotelSlug: draft.hotelSlug,
        roomCategorySlug: draft.roomCategorySlug,
        name: draft.name ?? '',
        phone: draft.phone ?? '',
        guests: draft.guests ?? 1,
        dateFrom: draft.dateFrom ?? '',
        dateTo: draft.dateTo,
        status: 'CONFIRMED',
      },
      draft.hotelSlug,
    );
    bookDrafts.delete(chatId);
    await sendMessage({
      chat_id: chatId,
      text: result.ok
        ? `✅ Бронювання створено (#${result.id?.slice(0, 8)}). Воно вже в адмінці.`
        : `⚠️ Не вдалося: ${result.error}`,
    });
    return;
  }
}

/** Handle the free-text steps of /book. Returns true if it consumed the message. */
async function handleBookText(chatId: number, text: string): Promise<boolean> {
  const draft = getDraft(chatId);
  if (!draft) return false;
  draft.expiresAt = Date.now() + BOOK_TTL_MS;

  switch (draft.step) {
    case 'dateFrom': {
      if (!ISO_DATE.test(text) || Number.isNaN(Date.parse(text))) {
        await sendMessage({ chat_id: chatId, text: 'Невірна дата. Формат РРРР-ММ-ДД:' });
        return true;
      }
      draft.dateFrom = text;
      draft.step = 'dateTo';
      await sendMessage({ chat_id: chatId, text: 'Крок 4/6 — дата виїзду (РРРР-ММ-ДД):' });
      return true;
    }
    case 'dateTo': {
      if (!ISO_DATE.test(text) || Number.isNaN(Date.parse(text))) {
        await sendMessage({ chat_id: chatId, text: 'Невірна дата. Формат РРРР-ММ-ДД:' });
        return true;
      }
      if (draft.dateFrom && Date.parse(text) <= Date.parse(draft.dateFrom)) {
        await sendMessage({ chat_id: chatId, text: 'Виїзд має бути пізніше заїзду. Введіть ще раз:' });
        return true;
      }
      draft.dateTo = text;
      draft.step = 'guests';
      await sendMessage({ chat_id: chatId, text: 'Крок 5/6 — кількість гостей (число):' });
      return true;
    }
    case 'guests': {
      const n = parseInt(text, 10);
      if (!Number.isFinite(n) || n < 1 || n > 50) {
        await sendMessage({ chat_id: chatId, text: 'Введіть число від 1 до 50:' });
        return true;
      }
      draft.guests = n;
      draft.step = 'name';
      await sendMessage({ chat_id: chatId, text: "Крок 6/6 — ім'я гостя:" });
      return true;
    }
    case 'name': {
      if (text.trim().length < 2) {
        await sendMessage({ chat_id: chatId, text: "Вкажіть ім'я (мінімум 2 символи):" });
        return true;
      }
      draft.name = text.trim();
      draft.step = 'phone';
      await sendMessage({ chat_id: chatId, text: 'Телефон гостя:' });
      return true;
    }
    case 'phone': {
      if (text.replace(/\D/g, '').length < 10) {
        await sendMessage({ chat_id: chatId, text: 'Невірний телефон. Введіть ще раз:' });
        return true;
      }
      draft.phone = text.trim();
      draft.step = 'confirm';
      const summary =
        `<b>Перевірте бронювання</b>\n\n` +
        `Готель: ${draft.hotelSlug ? HOTEL_LABELS[draft.hotelSlug] : '—'}\n` +
        `Номер: ${draft.roomCategorySlug}\n` +
        `Заїзд: ${draft.dateFrom}\nВиїзд: ${draft.dateTo}\n` +
        `Гостей: ${draft.guests}\nІм'я: ${draft.name}\nТелефон: ${draft.phone}`;
      await sendMessage({
        chat_id: chatId,
        text: summary,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Створити', callback_data: 'book:confirm' },
              { text: '✖️ Скасувати', callback_data: 'book:cancel' },
            ],
          ],
        },
      });
      return true;
    }
    default:
      return false;
  }
}

/* ─── Dispatcher ─── */

async function handleMessage(message: TelegramMessage): Promise<void> {
  const chatId = message.chat.id;
  const rawText = (message.text ?? '').trim();
  const userName = message.from?.first_name;

  if (message.contact) {
    await handleContact(chatId, message.contact);
    return;
  }

  // Active /book conversation: capture free-text answers, unless it's a command
  // or a main-menu button (those abort the flow and route normally).
  if (
    rawText &&
    !rawText.startsWith('/') &&
    !(rawText in REPLY_BUTTON_COMMANDS) &&
    getDraft(chatId)
  ) {
    if (await handleBookText(chatId, rawText)) return;
  }

  // Map reply-keyboard button labels to commands transparently.
  // "🍽 Меню" → "/menu" etc. so both tap-button and typed commands are routed.
  const text = REPLY_BUTTON_COMMANDS[rawText] ?? rawText;

  if (text.startsWith('/start')) {
    await handleStart(chatId, userName);
    return;
  }
  if (text.startsWith('/menu')) {
    await handleMenuFlow(chatId);
    return;
  }
  if (text.startsWith('/hotel')) {
    await handleHotelFlow(chatId);
    return;
  }
  if (text.startsWith('/aquapark')) {
    await handleAquaparkFlow(chatId);
    return;
  }
  if (text.startsWith('/sauna')) {
    await handleSaunaFlow(chatId);
    return;
  }
  if (text.startsWith('/orders')) {
    await handleOrdersFlow(chatId);
    return;
  }
  if (text.startsWith('/pending')) {
    await handlePending(chatId);
    return;
  }
  if (text.startsWith('/book')) {
    await startBook(chatId);
    return;
  }
  if (text.startsWith('/help')) {
    await handleStart(chatId, userName);
    return;
  }

  // Fallback: show main menu with persistent reply keyboard
  await sendMessage({
    chat_id: chatId,
    text: 'Не впізнав команду. Оберіть нижче що вас цікавить:',
    reply_markup: mainReplyKeyboard(),
  });
}

/** Run an admin status action from a tapped notification button. */
async function handleAdminAction(
  query: CallbackQuery,
  parsed: { action: StatusAction; entity: PaymentType; id: string },
): Promise<void> {
  // Authorize the USER who tapped (query.from), not the (possibly group) chat.
  if (!isAdminChat(query.from.id)) {
    await answerCallbackQuery({
      callback_query_id: query.id,
      text: 'Немає доступу',
      show_alert: true,
    });
    return;
  }

  const target = actionToStatus(parsed.entity, parsed.action);
  if (!target) {
    await answerCallbackQuery({
      callback_query_id: query.id,
      text: 'Дія недоступна для цього типу',
      show_alert: true,
    });
    return;
  }

  const result = await changeStatus(
    parsed.entity,
    parsed.id,
    target,
    { notifyGuest: true, actor: String(query.from.id) },
    parsed.action,
  );

  if (!result.ok) {
    await answerCallbackQuery({
      callback_query_id: query.id,
      text: result.error ?? 'Помилка',
      show_alert: true,
    });
    return;
  }

  await answerCallbackQuery({
    callback_query_id: query.id,
    text: result.alreadyDone ? 'Вже виконано' : 'Готово ✓',
  });

  // Stamp the original notification and drop its buttons so it can't be re-tapped.
  if (query.message) {
    const stamp = `\n\n— ${statusLabel(target)} (${query.from.first_name ?? 'адмін'})`;
    try {
      await editMessageText({
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        text: (query.message.text ?? '') + stamp,
        reply_markup: { inline_keyboard: [] },
      });
    } catch {
      /* message too old / unchanged — the action still succeeded */
    }
  }
}

async function handleCallbackQuery(query: CallbackQuery): Promise<void> {
  const data = query.data ?? '';

  // Admin status actions ("action:entity:id") — handle BEFORE the generic ack so
  // we can answer with a toast / access-denied alert.
  const adminAction = parseAdminCallback(data);
  if (adminAction) {
    await handleAdminAction(query, adminAction);
    return;
  }

  // Admin /book conversational steps
  if (data.startsWith('book:')) {
    await handleBookCallback(query, data.slice('book:'.length));
    return;
  }

  const chatId = query.message?.chat.id;

  // Public flows: acknowledge first
  await answerCallbackQuery({ callback_query_id: query.id });

  if (!chatId) return;

  if (data === 'flow:start') {
    await handleStart(chatId, query.from.first_name);
    return;
  }
  if (data === 'flow:menu') {
    await handleMenuFlow(chatId);
    return;
  }
  if (data === 'flow:hotel') {
    await handleHotelFlow(chatId);
    return;
  }
  if (data === 'flow:aquapark') {
    await handleAquaparkFlow(chatId);
    return;
  }
  if (data === 'flow:sauna') {
    await handleSaunaFlow(chatId);
    return;
  }
  if (data === 'flow:orders') {
    await handleOrdersFlow(chatId);
    return;
  }
}

export async function handleUpdate(update: TelegramUpdate): Promise<void> {
  try {
    if (update.message) {
      await handleMessage(update.message);
    } else if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }
  } catch (err) {
    console.error('[telegram-bot] handler error:', err);
  }
}
