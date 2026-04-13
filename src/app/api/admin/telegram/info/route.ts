/**
 * GET /api/admin/telegram/info — returns bot info + webhook status.
 * Admin-only.
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getMe, getWebhookInfo, isBotConfigured } from '@/lib/telegram';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isBotConfigured()) {
    return NextResponse.json({
      configured: false,
      error: 'TELEGRAM_BOT_TOKEN не задано в .env.local',
    });
  }

  try {
    const [me, webhook] = await Promise.all([getMe(), getWebhookInfo()]);
    return NextResponse.json({
      configured: true,
      bot: me,
      webhook,
    });
  } catch (err) {
    return NextResponse.json({
      configured: true,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
