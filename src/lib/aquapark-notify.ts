/**
 * Notify channels for aquapark ticket purchases.
 */

import { AquaparkTicket } from '@/types/aquapark';
import { formatPrice } from '@/types/cart';

const PAYMENT_LABEL: Record<string, string> = {
  paid: 'Оплачено ✅',
  pending: 'Очікує оплати',
  failed: 'Помилка оплати ❌',
};

function buildText(t: AquaparkTicket): string {
  const lines: string[] = [];
  lines.push(`🎟 Новий квиток в аквапарк №${t.number}`);
  lines.push('');
  lines.push(`Статус: ${PAYMENT_LABEL[t.paymentStatus] ?? t.paymentStatus}`);
  lines.push(`Клієнт: ${t.customerName}`);
  lines.push(`Телефон: ${t.customerPhone}`);
  if (t.customerEmail) lines.push(`Email: ${t.customerEmail}`);
  lines.push(`Дата візиту: ${new Date(t.date).toLocaleDateString('uk-UA', { dateStyle: 'long' })}`);
  lines.push('');
  lines.push('— — — Квитки — — —');
  for (const item of t.items) {
    lines.push(`• ${item.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`);
  }
  lines.push('— — — — — — — — —');
  lines.push(`До сплати: ${formatPrice(t.total)}`);
  if (t.qrCode) {
    lines.push('');
    lines.push(`QR: ${t.qrCode}`);
  }
  return lines.join('\n');
}

async function notifyTelegram(t: AquaparkTicket): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: buildText(t) }),
    });
  } catch (err) {
    console.warn('[aquapark-notify] Telegram error:', err);
  }
}

async function notifyEmail(t: AquaparkTicket): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDERS_EMAIL_TO || process.env.BOOKING_EMAIL_TO;
  const from =
    process.env.ORDERS_EMAIL_FROM ||
    process.env.BOOKING_EMAIL_FROM ||
    'tickets@gluhoman.com.ua';
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
        subject: `Новий квиток в аквапарк №${t.number} — ${formatPrice(t.total)}`,
        text: buildText(t),
      }),
    });
  } catch (err) {
    console.warn('[aquapark-notify] Resend error:', err);
  }
}

export async function notifyNewAquaparkTicket(t: AquaparkTicket): Promise<void> {
  console.log('[aquapark-notify] new ticket:', t.number, t.id, t.paymentStatus);
  console.log(buildText(t));
  await Promise.all([notifyTelegram(t), notifyEmail(t)]);
}
