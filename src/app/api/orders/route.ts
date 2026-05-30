/**
 * POST /api/orders — create a new order in PENDING state.
 *
 * Validates input, persists via order-storage, returns the created order.
 * The frontend then calls /api/payment/liqpay/create to get the payment payload.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { orderStorage } from '@/lib/order-storage';
import { menuPriceFor } from '@/lib/menu-prices';
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  MIN_ORDER,
  OrderInput,
} from '@/types/cart';

const CreateOrderSchema = z.object({
  customerName: z.string().trim().min(2, 'Ім\'я обов\'язкове'),
  customerPhone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{10,}$/, 'Невірний формат телефону'),
  deliveryType: z.enum(['delivery', 'pickup']),
  address: z.string().trim().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
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
    .min(1, 'Кошик порожній'),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Невалідний JSON' }, { status: 400 });
  }

  const parsed = CreateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Невалідні дані', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Cross-field validation
  if (data.deliveryType === 'delivery' && (!data.address || data.address.length < 5)) {
    return NextResponse.json(
      { error: 'Адреса доставки обов\'язкова' },
      { status: 400 }
    );
  }

  // Resolve every line's price from the server-side menu — NEVER trust the
  // price the client sent (otherwise an attacker pays 1 грн for a 550 грн dish).
  // An id no longer on the menu is rejected so stale carts can't order it.
  const lineItems: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
  }[] = [];
  for (const i of data.items) {
    const price = menuPriceFor(i.menuItemId);
    if (price == null) {
      return NextResponse.json(
        { error: 'Деякі позиції більше недоступні. Оновіть кошик.' },
        { status: 409 }
      );
    }
    lineItems.push({
      menuItemId: i.menuItemId,
      name: i.name,
      price,
      quantity: i.quantity,
    });
  }

  // Recalculate totals server-side from the resolved prices.
  const subtotal = lineItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

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
    scheduledAt: data.scheduledAt ?? null,
    comment: data.comment,
    items: lineItems,
    subtotal,
    deliveryFee,
    total,
  };

  const order = await orderStorage.create(input);

  return NextResponse.json({
    id: order.id,
    number: order.number,
    total: order.total,
    paymentStatus: order.paymentStatus,
  });
}
