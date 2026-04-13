/**
 * Notification side-effects for new paid orders.
 *
 * Two channels:
 *  1. Email via Resend (if RESEND_API_KEY + ORDERS_EMAIL_TO/BOOKING_EMAIL_TO set)
 *  2. Telegram via existing TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (if set)
 *
 * Both are best-effort: failures are logged, never thrown — paying flow
 * never breaks because of a notification hiccup.
 */

import { Order, formatPrice } from '@/types/cart';

const PAYMENT_LABEL: Record<string, string> = {
  paid: 'Оплачено ✅',
  pending: 'Очікує оплати',
  failed: 'Помилка оплати ❌',
};

function buildText(order: Order): string {
  const lines: string[] = [];
  lines.push(`🍽 Нове замовлення №${order.number}`);
  lines.push('');
  lines.push(`Статус оплати: ${PAYMENT_LABEL[order.paymentStatus] ?? order.paymentStatus}`);
  lines.push(`Клієнт: ${order.customerName}`);
  lines.push(`Телефон: ${order.customerPhone}`);
  lines.push(
    `Тип: ${order.deliveryType === 'delivery' ? 'Доставка' : 'Самовивіз'}`
  );
  if (order.deliveryType === 'delivery' && order.address) {
    lines.push(`Адреса: ${order.address}`);
  }
  if (order.scheduledAt) {
    const dt = new Date(order.scheduledAt);
    lines.push(`Час: ${dt.toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' })}`);
  } else {
    lines.push('Час: якнайшвидше');
  }
  if (order.comment) {
    lines.push(`Коментар: ${order.comment}`);
  }
  lines.push('');
  lines.push('— — — Позиції — — —');
  for (const item of order.items) {
    lines.push(`• ${item.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`);
  }
  lines.push('— — — — — — — — —');
  lines.push(`Сума: ${formatPrice(order.subtotal)}`);
  lines.push(
    `Доставка: ${order.deliveryFee === 0 ? 'безкоштовно' : formatPrice(order.deliveryFee)}`
  );
  lines.push(`До сплати: ${formatPrice(order.total)}`);
  return lines.join('\n');
}

async function notifyTelegram(order: Order): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildText(order),
        parse_mode: 'HTML',
      }),
    });
    if (!res.ok) {
      console.warn('[order-notify] Telegram failed:', res.status, await res.text());
    }
  } catch (err) {
    console.warn('[order-notify] Telegram error:', err);
  }
}

async function notifyEmail(order: Order): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDERS_EMAIL_TO || process.env.BOOKING_EMAIL_TO;
  const from =
    process.env.ORDERS_EMAIL_FROM ||
    process.env.BOOKING_EMAIL_FROM ||
    'orders@gluhoman.com.ua';
  if (!apiKey || !to) return;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Нове замовлення №${order.number} — ${formatPrice(order.total)}`,
        text: buildText(order),
      }),
    });
    if (!res.ok) {
      console.warn('[order-notify] Resend failed:', res.status, await res.text());
    }
  } catch (err) {
    console.warn('[order-notify] Resend error:', err);
  }
}

/**
 * Fire-and-forget notification dispatch. Never throws.
 * Currently always logs the order to the console too (handy in dev).
 */
export async function notifyNewOrder(order: Order): Promise<void> {
  console.log('[order-notify] new order:', order.number, order.id, order.paymentStatus);
  console.log(buildText(order));
  await Promise.all([notifyTelegram(order), notifyEmail(order)]);
}
