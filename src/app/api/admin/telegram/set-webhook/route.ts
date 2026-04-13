/**
 * POST /api/admin/telegram/set-webhook — sets the bot webhook to {site}/api/telegram/webhook.
 * Admin-only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { deleteWebhook, setWebhook, isBotConfigured } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isBotConfigured()) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN не задано' }, { status: 400 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    url?: string;
    action?: 'set' | 'delete';
  };

  try {
    if (body.action === 'delete') {
      await deleteWebhook();
      return NextResponse.json({ ok: true, action: 'deleted' });
    }

    // Determine webhook URL from body or from request origin
    let url = body.url;
    if (!url) {
      const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
      if (envUrl) {
        url = `${envUrl.replace(/\/$/, '')}/api/telegram/webhook`;
      } else {
        const reqUrl = new URL(req.url);
        url = `${reqUrl.protocol}//${reqUrl.host}/api/telegram/webhook`;
      }
    }

    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    await setWebhook(url, secret);
    return NextResponse.json({ ok: true, action: 'set', url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
