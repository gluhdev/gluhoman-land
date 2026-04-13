/**
 * POST /api/admin/orders/manual — admin creates an order on behalf of a phone caller.
 *
 * Differences from public POST /api/orders:
 *  - Admin auth required
 *  - Order is created as PAID + CONFIRMED immediately (no LiqPay step)
 *  - Notifications still fire so the kitchen sees it
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { orderStorage } from '@/lib/order-storage';
import { notifyNewOrder } from '@/lib/order-notify';
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  MIN_ORDER,
  OrderInput,
} from '@/types/cart';

const Schema = z.object({
  customerName: z.string().trim().min(2),
  customerPhone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{10,}$/),
  deliveryType: z.enum(['delivery', 'pickup']),
  address: z.string().trim().optional(),
  comment: z.string().trim().max(500).optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        name: z.string().min(1),
        price: z.number().int().positive(),
        quantity: z.number().int().positive().max(99),
      })
    )
    .min(1),
});

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
    return NextResponse.json(
      { error: 'Невалідні дані', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (data.deliveryType === 'delivery' && (!data.address || data.address.length < 5)) {
    return NextResponse.json({ error: "Адреса доставки обов'язкова" }, { status: 400 });
  }

  const subtotal = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  if (subtotal < MIN_ORDER) {
    return NextResponse.json(
      { error: `Мінімальна сума замовлення ${MIN_ORDER} грн` },
      { status: 400 }
    );
  }

  const deliveryFee =
    data.deliveryType === 'pickup' || subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const input: OrderInput = {
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    deliveryType: data.deliveryType,
    address: data.deliveryType === 'delivery' ? data.address : undefined,
    scheduledAt: null,
    comment: data.comment,
    items: data.items.map((i) => ({
      menuItemId: i.menuItemId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
    subtotal,
    deliveryFee,
    total,
  };

  // Create
  const order = await orderStorage.create(input);
  // Mark as paid + confirmed (admin creates these for already-paid phone callers)
  const updated = await orderStorage.updatePayment(order.id, 'paid', {
    status: 'CONFIRMED',
    paymentExternalId: `manual-${session.user.email ?? 'admin'}`,
  });

  if (updated) {
    notifyNewOrder(updated).catch(() => {});
  }

  return NextResponse.json({
    id: order.id,
    number: order.number,
    total: order.total,
  });
}
