/**
 * POST /api/admin/aquapark/scan — verify and consume an aquapark ticket QR.
 *
 * Body: { qrCode: string }
 *
 * Returns:
 *   { ok: true, ticket } if QR matches a paid ticket and was just marked as used
 *   { ok: false, reason: 'not-found' | 'unpaid' | 'used' | 'cancelled' | 'wrong-date', ticket? }
 *
 * Admin-only (auth required).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { aquaparkStorage } from '@/lib/aquapark-storage';

const Schema = z.object({
  qrCode: z.string().trim().min(1),
});

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Невалідний JSON' }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Невалідні дані' }, { status: 400 });
  }

  const ticket = await aquaparkStorage.getByQr(parsed.data.qrCode);
  if (!ticket) {
    return NextResponse.json({ ok: false, reason: 'not-found' }, { status: 200 });
  }

  if (ticket.paymentStatus !== 'paid') {
    return NextResponse.json({ ok: false, reason: 'unpaid', ticket }, { status: 200 });
  }
  if (ticket.status === 'used') {
    return NextResponse.json({ ok: false, reason: 'used', ticket }, { status: 200 });
  }
  if (ticket.status === 'cancelled' || ticket.status === 'refunded') {
    return NextResponse.json({ ok: false, reason: 'cancelled', ticket }, { status: 200 });
  }
  if (!isToday(ticket.date)) {
    // Wrong date — let admin override if needed (just flag, don't block)
    return NextResponse.json({ ok: false, reason: 'wrong-date', ticket }, { status: 200 });
  }

  // All good — mark as used
  const updated = await aquaparkStorage.updateStatus(ticket.id, 'used');
  return NextResponse.json({ ok: true, ticket: updated });
}
