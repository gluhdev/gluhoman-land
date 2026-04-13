/**
 * GET /api/hotel/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&guests=N
 *
 * Returns the list of rooms that are FREE for the requested window
 * and have capacity ≥ guests.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { bookingStorage } from '@/lib/booking-storage';
import { getNights } from '@/types/booking';
import { prisma } from '@/lib/prisma';

const STALE_PENDING_MS = 30 * 60 * 1000;

async function cancelStalePending() {
  const cutoff = new Date(Date.now() - STALE_PENDING_MS);
  try {
    await prisma.hotelBooking.updateMany({
      where: {
        paymentStatus: 'pending',
        status: 'pending',
        createdAt: { lt: cutoff },
      },
      data: { status: 'cancelled' },
    });
  } catch {
    // best-effort sweep; never block availability on it
  }
}

const Schema = z.object({
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'),
  guests: z.coerce.number().int().min(1).max(10),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = Schema.safeParse({
    checkIn: url.searchParams.get('checkIn'),
    checkOut: url.searchParams.get('checkOut'),
    guests: url.searchParams.get('guests'),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Невалідні параметри' }, { status: 400 });
  }

  const { checkIn, checkOut, guests } = parsed.data;
  const nights = getNights(checkIn, checkOut);
  if (nights < 1) {
    return NextResponse.json({ error: 'Виїзд має бути після заїзду' }, { status: 400 });
  }

  await cancelStalePending();
  const rooms = await bookingStorage.findAvailableRooms(checkIn, checkOut, guests);
  return NextResponse.json({
    nights,
    guests,
    checkIn,
    checkOut,
    rooms: rooms.map((r) => ({
      id: r.id,
      number: r.number,
      type: r.type,
      capacity: r.capacity,
      pricePerNight: r.pricePerNight,
      description: r.description,
      images: r.images,
      total: r.pricePerNight * nights,
    })),
  });
}
