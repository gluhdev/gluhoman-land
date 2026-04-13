/**
 * POST /api/telegram/webhook — Telegram update receiver.
 *
 * Configure Telegram to POST updates here:
 *   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<domain>/api/telegram/webhook"
 *
 * Or use the admin helper at /admin/telegram which calls /api/admin/telegram/set-webhook.
 *
 * Optional security: if `TELEGRAM_WEBHOOK_SECRET` is set, we require Telegram to
 * send the same secret in the `X-Telegram-Bot-Api-Secret-Token` header.
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleUpdate } from '@/lib/telegram-bot';
import { TelegramUpdate } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  // Optional secret check
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret) {
    const gotSecret = req.headers.get('x-telegram-bot-api-secret-token');
    if (gotSecret !== expectedSecret) {
      console.warn('[telegram-webhook] invalid secret');
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  // Process async; return 200 quickly so Telegram doesn't retry
  handleUpdate(update).catch((err) => {
    console.error('[telegram-webhook] handler error:', err);
  });

  return NextResponse.json({ ok: true });
}

// Telegram sometimes sends GET during setup verification
export async function GET() {
  return NextResponse.json({ ok: true, service: 'telegram-webhook' });
}
