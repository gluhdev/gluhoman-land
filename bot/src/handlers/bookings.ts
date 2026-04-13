import type { Context } from 'telegraf';
import { prisma } from '../lib/db.js';
import {
  formatBookingShort,
  formatBookingFull,
  serviceEmoji,
} from '../lib/format.js';

const NOT_ADMIN = 'Ця команда лише для адміністраторів.';

function isAdmin(ctx: Context, adminIds: number[]): boolean {
  return !!ctx.chat && adminIds.includes(ctx.chat.id);
}

export async function bookingsHandler(
  ctx: Context,
  adminIds: number[]
): Promise<void> {
  if (!isAdmin(ctx, adminIds)) {
    await ctx.reply(NOT_ADMIN);
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bookings = await (prisma as any).booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (!bookings.length) {
      await ctx.reply('Бронювань ще немає.');
      return;
    }

    const header = '*Останні 10 бронювань:*\n\n';
    const body = bookings.map(formatBookingShort).join('\n');
    await ctx.reply(header + body, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('[bot] bookingsHandler error', err);
    await ctx.reply('Помилка при отриманні бронювань.');
  }
}

export async function bookingByIdHandler(
  ctx: Context,
  adminIds: number[]
): Promise<void> {
  if (!isAdmin(ctx, adminIds)) {
    await ctx.reply(NOT_ADMIN);
    return;
  }

  const text =
    ctx.message && 'text' in ctx.message ? ctx.message.text : '';
  const parts = text.trim().split(/\s+/);
  const idPrefix = parts[1];

  if (!idPrefix) {
    await ctx.reply('Використання: /booking <id>');
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const booking = await (prisma as any).booking.findFirst({
      where: { id: { startsWith: idPrefix } },
    });

    if (!booking) {
      await ctx.reply(`Бронювання з ID \`${idPrefix}\` не знайдено.`, {
        parse_mode: 'Markdown',
      });
      return;
    }

    await ctx.reply(formatBookingFull(booking), { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('[bot] bookingByIdHandler error', err);
    await ctx.reply('Помилка при пошуку бронювання.');
  }
}

export async function statsHandler(
  ctx: Context,
  adminIds: number[]
): Promise<void> {
  if (!isAdmin(ctx, adminIds)) {
    await ctx.reply(NOT_ADMIN);
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const total = await (prisma as any).booking.count();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const byService = await (prisma as any).booking.groupBy({
      by: ['service'],
      _count: { _all: true },
    });

    const lines = [
      '*Статистика бронювань*',
      '',
      `Всього: *${total}*`,
      '',
      'За послугою:',
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const row of byService as any[]) {
      const svc = row.service || '—';
      const count = row._count?._all ?? 0;
      lines.push(`${serviceEmoji(svc)} ${svc}: ${count}`);
    }

    await ctx.reply(lines.join('\n'), { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('[bot] statsHandler error', err);
    await ctx.reply('Помилка при отриманні статистики.');
  }
}
