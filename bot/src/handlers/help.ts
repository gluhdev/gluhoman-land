import type { Context } from 'telegraf';

export async function helpHandler(ctx: Context): Promise<void> {
  const message = [
    'Доступні команди:',
    '',
    '/start — привітання та опис бота',
    '/help — цей список',
    '',
    'Команди для адміністраторів:',
    '/bookings — останні 10 бронювань',
    '/booking <id> — деталі бронювання за ID',
    '/stats — статистика бронювань',
  ].join('\n');

  await ctx.reply(message);
}
