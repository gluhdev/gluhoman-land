'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export type BookingStatusValue = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export async function updateBookingStatus(
  id: string,
  status: BookingStatusValue
): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: 'Missing id' };
  if (!['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status))
    return { ok: false, error: 'Invalid status' };

  try {
    await prisma.booking.update({ where: { id }, data: { status } });
    revalidatePath('/admin/bookings');
    revalidatePath(`/admin/bookings/${id}`);
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Update failed',
    };
  }
}
