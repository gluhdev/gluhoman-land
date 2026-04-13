/**
 * Notify channels for new paid sauna reservations.
 */

import { SaunaSlot, SAUNA_TYPE_LABEL } from '@/types/sauna';
import { formatPrice } from '@/types/cart';

const PAYMENT_LABEL: Record<string, string> = {
  paid: 'Оплачено ✅',
  pending: 'Очікує оплати',
  failed: 'Помилка оплати ❌',
};

function buildText(s: SaunaSlot): string {
  const lines: string[] = [];
  lines.push(`🔥 Нове бронювання лазні №${s.number}`);
  lines.push('');
  lines.push(`Статус: ${PAYMENT_LABEL[s.paymentStatus] ?? s.paymentStatus}`);
  if (s.customerName) lines.push(`Клієнт: ${s.customerName}`);
  if (s.customerPhone) lines.push(`Телефон: ${s.customerPhone}`);
  if (s.customerEmail) lines.push(`Email: ${s.customerEmail}`);
  lines.push('');
  lines.push(`Лазня: ${SAUNA_TYPE_LABEL[s.saunaType]}`);
  lines.push(`Дата: ${new Date(s.date).toLocaleDateString('uk-UA', { dateStyle: 'long' })}`);
  lines.push(`Час: ${s.startTime} — ${s.endTime}`);
  if (s.comment) lines.push(`Коментар: ${s.comment}`);
  lines.push('');
  if (s.total) lines.push(`До сплати: ${formatPrice(s.total)}`);
  return lines.join('\n');
}

async function notifyTelegram(s: SaunaSlot): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: buildText(s) }),
    });
  } catch (err) {
    console.warn('[sauna-notify] Telegram error:', err);
  }
}

async function notifyEmail(s: SaunaSlot): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDERS_EMAIL_TO || process.env.BOOKING_EMAIL_TO;
  const from =
    process.env.ORDERS_EMAIL_FROM ||
    process.env.BOOKING_EMAIL_FROM ||
    'sauna@gluhoman.com.ua';
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
        subject: `Нове бронювання лазні №${s.number}${s.total ? ` — ${formatPrice(s.total)}` : ''}`,
        text: buildText(s),
      }),
    });
  } catch (err) {
    console.warn('[sauna-notify] Resend error:', err);
  }
}

export async function notifyNewSaunaSlot(s: SaunaSlot): Promise<void> {
  console.log('[sauna-notify] new slot:', s.number, s.id, s.paymentStatus);
  console.log(buildText(s));
  await Promise.all([notifyTelegram(s), notifyEmail(s)]);
}
