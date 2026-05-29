'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { isHotelSlug } from '@/lib/admin-hotels';

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

  const name = input.name.trim();
  const phone = input.phone.trim();
  if (!name) return { ok: false, error: "Вкажіть ім'я гостя" };
  if (!phone) return { ok: false, error: 'Вкажіть телефон' };
  if (!input.roomCategorySlug) return { ok: false, error: 'Оберіть номер' };

  const dateFrom = new Date(input.dateFrom);
  if (Number.isNaN(dateFrom.getTime()))
    return { ok: false, error: 'Невірна дата заїзду' };
  let dateTo: Date | null = null;
  if (input.dateTo) {
    const d = new Date(input.dateTo);
    if (Number.isNaN(d.getTime())) return { ok: false, error: 'Невірна дата виїзду' };
    if (d <= dateFrom) return { ok: false, error: 'Дата виїзду має бути пізніше заїзду' };
    dateTo = d;
  }

  const guests = Number.isFinite(input.guests) ? Math.max(1, Math.trunc(input.guests)) : 1;
  const status = (['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const).includes(
    input.status
  )
    ? input.status
    : 'CONFIRMED';

  const note = ['Ручне бронювання (адмін)', input.comment?.trim()]
    .filter(Boolean)
    .join(' · ');

  try {
    const booking = await prisma.booking.create({
      data: {
        service: 'HOTEL',
        status,
        name,
        phone,
        email: input.email?.trim() || null,
        guests,
        dateFrom,
        dateTo,
        comment: note,
        hotelSlug,
        roomCategorySlug: input.roomCategorySlug,
        telegramStatus: 'SENT',
        emailStatus: 'SENT',
      },
    });
    revalidatePath('/admin/bookings');
    return { ok: true, id: booking.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Помилка створення' };
  }
}

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
