/**
 * POST /api/admin/orders/[id]/status
 *
 * Admin-only endpoint to change order status.
 * Protected by NextAuth — checks session before allowing.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { orderStorage } from '@/lib/order-storage';
import { changeStatus } from '@/lib/status-service';

const Schema = z.object({
  status: z.enum([
    'PENDING',
    'PAID',
    'CONFIRMED',
    'PREPARING',
    'DELIVERING',
    'COMPLETED',
    'CANCELLED',
  ]),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    return NextResponse.json({ error: 'Невірний статус' }, { status: 400 });
  }

  const { id } = await params;
  const result = await changeStatus('order', id, parsed.data.status, {
    hotelSlug: session.user.hotelSlug ?? null,
    notifyGuest: true,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const updated = await orderStorage.get(id);
  return NextResponse.json({ ok: true, order: updated });
}
