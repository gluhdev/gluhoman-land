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
} from '@/lib/telegram';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';

// In-memory phone cache (per chatId) — ephemeral, resets on server restart
const phoneCache = new Map<number, string>();

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

/* ─── Dispatcher ─── */

async function handleMessage(message: TelegramMessage): Promise<void> {
  const chatId = message.chat.id;
  const rawText = (message.text ?? '').trim();
  const userName = message.from?.first_name;

  if (message.contact) {
    await handleContact(chatId, message.contact);
    return;
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

async function handleCallbackQuery(query: CallbackQuery): Promise<void> {
  const chatId = query.message?.chat.id;
  const data = query.data ?? '';

  // Always acknowledge first
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
