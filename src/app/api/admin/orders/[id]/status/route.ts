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
import { OrderStatus } from '@/types/cart';

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
  const updated = await orderStorage.updateStatus(id, parsed.data.status as OrderStatus);
  if (!updated) {
    return NextResponse.json({ error: 'Замовлення не знайдено' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, order: updated });
}
