/**
 * Notify channels for new paid hotel bookings.
 * Same pattern as order-notify.ts.
 */

import { HotelBooking, ROOM_TYPE_LABEL, getNights } from '@/types/booking';
import { formatPrice } from '@/types/cart';

const PAYMENT_LABEL: Record<string, string> = {
  paid: 'Оплачено ✅',
  pending: 'Очікує оплати',
  failed: 'Помилка оплати ❌',
};

function buildText(b: HotelBooking): string {
  const lines: string[] = [];
  const nights = getNights(b.checkIn, b.checkOut);
  const room = b.room;

  lines.push(`🏨 Нове бронювання №${b.number}`);
  lines.push('');
  lines.push(`Статус: ${PAYMENT_LABEL[b.paymentStatus] ?? b.paymentStatus}`);
  lines.push(`Клієнт: ${b.customerName}`);
  lines.push(`Телефон: ${b.customerPhone}`);
  if (b.customerEmail) lines.push(`Email: ${b.customerEmail}`);
  lines.push('');
  if (room) {
    lines.push(`Номер: ${room.number} (${ROOM_TYPE_LABEL[room.type] ?? room.type})`);
  }
  lines.push(
    `Заїзд: ${new Date(b.checkIn).toLocaleDateString('uk-UA', { dateStyle: 'long' })}`
  );
  lines.push(
    `Виїзд: ${new Date(b.checkOut).toLocaleDateString('uk-UA', { dateStyle: 'long' })}`
  );
  lines.push(`Ночей: ${nights}`);
  lines.push(`Гостей: ${b.guests}`);
  if (b.comment) lines.push(`Коментар: ${b.comment}`);
  lines.push('');
  lines.push(`До сплати: ${formatPrice(b.total)}`);
  return lines.join('\n');
}

async function notifyTelegram(b: HotelBooking): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: buildText(b) }),
    });
  } catch (err) {
    console.warn('[booking-notify] Telegram error:', err);
  }
}

async function notifyEmail(b: HotelBooking): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDERS_EMAIL_TO || process.env.BOOKING_EMAIL_TO;
  const from =
    process.env.ORDERS_EMAIL_FROM ||
    process.env.BOOKING_EMAIL_FROM ||
    'bookings@gluhoman.com.ua';
  if (!apiKey || !to) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Нове бронювання №${b.number} — ${formatPrice(b.total)}`,
        text: buildText(b),
      }),
    });
  } catch (err) {
    console.warn('[booking-notify] Resend error:', err);
  }
}

export async function notifyNewBooking(b: HotelBooking): Promise<void> {
  console.log('[booking-notify] new booking:', b.number, b.id, b.paymentStatus);
  console.log(buildText(b));
  await Promise.all([notifyTelegram(b), notifyEmail(b)]);
}
