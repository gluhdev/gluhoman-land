import { Telegraf } from 'telegraf';
import { startHandler } from './handlers/start.js';
import { helpHandler } from './handlers/help.js';
import {
  bookingsHandler,
  bookingByIdHandler,
  statsHandler,
} from './handlers/bookings.js';

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('[bot] BOT_TOKEN not set');
  process.exit(1);
}

const adminIds = (process.env.ADMIN_CHAT_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .map(Number);

const bot = new Telegraf(token);

bot.command('start', startHandler);
bot.command('help', helpHandler);
bot.command('bookings', (ctx) => bookingsHandler(ctx, adminIds));
bot.command('booking', (ctx) => bookingByIdHandler(ctx, adminIds));
bot.command('stats', (ctx) => statsHandler(ctx, adminIds));

bot.on('text', async (ctx) => {
  // Admins interact via commands; ignore free-form text from them
  if (adminIds.includes(ctx.chat.id)) return;
  await ctx.reply(
    "Дякую за повідомлення! Ми зв'яжемося з вами найближчим часом.\n\nАбо зателефонуйте: +38 053 264 8548"
  );
});

bot
  .launch()
  .then(() => console.log('[bot] Gluhoman bot started'))
  .catch((err) => {
    console.error('[bot] failed to launch', err);
    process.exit(1);
  });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
