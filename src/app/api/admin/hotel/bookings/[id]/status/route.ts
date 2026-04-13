/**
 * POST /api/admin/hotel/bookings/[id]/status
 * Admin-only — change a hotel booking status.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { bookingStorage } from '@/lib/booking-storage';
import { HotelBookingStatus } from '@/types/booking';

const Schema = z.object({
  status: z.enum(['pending', 'paid', 'confirmed', 'completed', 'cancelled']),
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
  const updated = await bookingStorage.updateStatus(id, parsed.data.status as HotelBookingStatus);
  if (!updated) {
    return NextResponse.json({ error: 'Бронювання не знайдено' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, booking: updated });
}
