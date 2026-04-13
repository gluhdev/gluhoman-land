/**
 * POST /api/hotel/bookings — create a new hotel booking.
 *
 * Validates input, checks availability, creates booking with status=pending.
 * Returns booking id which the frontend uses to start LiqPay flow.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { bookingStorage } from '@/lib/booking-storage';

const Schema = z.object({
  roomId: z.string().min(1),
  customerName: z.string().trim().min(2, "Ім'я обов'язкове"),
  customerPhone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{10,}$/, 'Невірний формат телефону'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().int().min(1).max(10),
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
  if (new Date(data.checkOut) <= new Date(data.checkIn)) {
    return NextResponse.json({ error: 'Виїзд має бути після заїзду' }, { status: 400 });
  }

  try {
    const booking = await bookingStorage.create({
      roomId: data.roomId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      comment: data.comment,
    });
    return NextResponse.json({
      id: booking.id,
      number: booking.number,
      total: booking.total,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Помилка створення бронювання';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
