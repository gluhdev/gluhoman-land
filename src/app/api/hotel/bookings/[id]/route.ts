/**
 * GET /api/hotel/bookings/[id] — read a booking by id.
 * Used by /hotel/booking/success page polling.
 */

import { NextRequest, NextResponse } from 'next/server';
import { bookingStorage } from '@/lib/booking-storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const booking = await bookingStorage.get(id);
  if (!booking) {
    return NextResponse.json({ error: 'Бронювання не знайдено' }, { status: 404 });
  }
  return NextResponse.json(booking);
}
