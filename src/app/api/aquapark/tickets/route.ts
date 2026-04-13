/**
 * POST /api/aquapark/tickets — create a new aquapark ticket order.
 *
 * Body: { date, customerName, customerPhone, customerEmail?, items: [{tariffId, quantity}] }
 *
 * Server validates, computes total, generates QR code on creation,
 * status starts as 'pending'. Frontend then calls /api/payment/liqpay/create
 * with entityType='aquapark' to start payment.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { aquaparkStorage } from '@/lib/aquapark-storage';

const Schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'),
  customerName: z.string().trim().min(2, "Ім'я обов'язкове"),
  customerPhone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{10,}$/, 'Невірний формат телефону'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  items: z
    .array(
      z.object({
        tariffId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, 'Оберіть хоча б один квиток'),
});

export async function POST(req: NextRequest) {
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
  // Date must be today or in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(data.date) < today) {
    return NextResponse.json({ error: 'Дата візиту має бути сьогодні або в майбутньому' }, { status: 400 });
  }

  try {
    const ticket = await aquaparkStorage.create({
      date: data.date,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      items: data.items,
    });
    return NextResponse.json({
      id: ticket.id,
      number: ticket.number,
      total: ticket.total,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Помилка створення квитка';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
