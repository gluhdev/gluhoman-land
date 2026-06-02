'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { isHotelSlug } from '@/lib/admin-hotels';
import { changeStatus } from '@/lib/status-service';
import { createBookingCore } from '@/lib/booking-create';

/**
 * Set the agreed price for a booking so it can be paid online, and return the
 * public payment-link path (/uk/pay/<id>) the admin sends to the guest. Once
 * the guest pays via LiqPay, the callback flips the booking to CONFIRMED/paid.
 * Hotel managers may only touch their own hotel's bookings.
 */
export async function createPaymentLink(
  bookingId: string,
  amount: number
): Promise<{ ok: boolean; error?: string; path?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Немає доступу' };
  if (!bookingId) return { ok: false, error: 'Missing id' };

  const amt = Math.trunc(amount);
  if (!Number.isFinite(amt) || amt <= 0)
    return { ok: false, error: 'Вкажіть суму більше 0' };

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return { ok: false, error: 'Бронювання не знайдено' };

  const scoped = session.user.hotelSlug ?? null;
  if (scoped && booking.hotelSlug !== scoped)
    return { ok: false, error: 'Немає доступу до цього готелю' };

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        totalAmount: amt,
        // a freshly (re)issued link is unpaid until the guest pays
        paymentStatus: booking.paymentStatus === 'paid' ? 'paid' : 'unpaid',
      },
    });
    revalidatePath(`/admin/bookings/${bookingId}`);
    return { ok: true, path: `/uk/pay/${bookingId}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Помилка' };
  }
}

export type BookingStatusValue = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface ManualBookingInput {
  hotelSlug: string;
  roomCategorySlug: string;
  name: string;
  phone: string;
  email?: string;
  guests: number;
  dateFrom: string; // ISO date (yyyy-mm-dd)
  dateTo?: string;
  comment?: string;
  status: BookingStatusValue;
}

/**
 * Create a booking by hand from the admin (phone/walk-in guests). Writes a
 * real Booking row (service=HOTEL) so it appears in the list and counts
 * against room availability. No Telegram/email is sent — the operator is
 * already aware. Hotel managers may only create for their own hotel.
 */
export async function createManualBooking(
  input: ManualBookingInput
): Promise<{ ok: boolean; error?: string; id?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Немає доступу' };

  const scoped = session.user.hotelSlug ?? null;
  const hotelSlug = scoped ?? input.hotelSlug;
  if (!isHotelSlug(hotelSlug)) return { ok: false, error: 'Оберіть готель' };
  if (scoped && input.hotelSlug && input.hotelSlug !== scoped)
    return { ok: false, error: 'Немає доступу до цього готелю' };

  const result = await createBookingCore(input, hotelSlug);
  if (result.ok) revalidatePath('/admin/bookings');
  return result;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatusValue
): Promise<{ ok: boolean; error?: string }> {
  // Server Actions are publicly addressable POST endpoints — without this check
  // anyone could confirm/cancel any booking by id. Mirror the auth + hotel-scope
  // guard used by createPaymentLink / createManualBooking.
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Немає доступу' };
  if (!id) return { ok: false, error: 'Missing id' };
  if (!['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status))
    return { ok: false, error: 'Invalid status' };

  // Delegate to the shared status seam: it loads the booking, re-checks hotel
  // scope, applies the status idempotently, and notifies operators + the guest.
  const scoped = session.user.hotelSlug ?? null;
  const result = await changeStatus('reservation', id, status, {
    hotelSlug: scoped,
    notifyGuest: true,
    actor: session.user.id,
  });
  if (!result.ok) return { ok: false, error: result.error };
  revalidatePath('/admin/bookings');
  revalidatePath(`/admin/bookings/${id}`);
  return { ok: true };
}
