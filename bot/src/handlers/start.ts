import { Markup } from 'telegraf';
import type { Context } from 'telegraf';

const SITE = process.env.SITE_URL || 'https://gluhoman.maxautomate.ai';
// Aquapark booking lives on an external system.
const AQUAPARK_BOOKING_URL = 'https://gluhoman.pl.ua/';

export async function startHandler(ctx: Context): Promise<void> {
  const message = [
    'Вітаємо у боті рекреаційного комплексу «Глухомань»! 🌲',
    '',
    'Оберіть, що бажаєте забронювати:',
    '',
    '📞 +38 053 264 8548',
  ].join('\n');

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('🏨 Готель', `${SITE}/hotel/booking`)],
    [Markup.button.url('🏊 Аквапарк', AQUAPARK_BOOKING_URL)],
    [Markup.button.url('🍽 Ресторан', `${SITE}/restaurant/booking`)],
    [Markup.button.url('🔥 Лазня', `${SITE}/sauna/booking`)],
  ]);

  await ctx.reply(message, keyboard);
}
