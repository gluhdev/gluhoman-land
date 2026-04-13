/**
 * POST /api/sauna/bookings — create a new sauna slot reservation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saunaStorage } from '@/lib/sauna-storage';

const Schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  saunaType: z.enum(['small', 'big']),
  customerName: z.string().trim().min(2, "Ім'я обов'язкове"),
  customerPhone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{10,}$/, 'Невірний формат телефону'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  comment: z.string().trim().max(500).optional(),
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(data.date) < today) {
    return NextResponse.json({ error: 'Дата має бути сьогодні або в майбутньому' }, { status: 400 });
  }

  try {
    const slot = await saunaStorage.create({
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      saunaType: data.saunaType,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      comment: data.comment,
    });
    return NextResponse.json({
      id: slot.id,
      number: slot.number,
      total: slot.total,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Помилка створення бронювання';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
