/**
 * Polymorphic payment router.
 *
 * LiqPay only stores ONE field for the merchant's id (`order_id`). To support
 * multiple entity types (Order, HotelBooking, AquaparkTicket, SaunaSlot) we
 * encode the type into the order_id as `{type}-{cuid}`. The callback parses
 * the prefix and routes to the correct storage.
 *
 * Adding a new entity type:
 *   1. Add a key to PAYMENT_TYPE
 *   2. Add a case to lookupEntity() and markPaid()
 *   3. Done — LiqPay endpoint handles it automatically.
 */

import { orderStorage } from '@/lib/order-storage';
import { bookingStorage } from '@/lib/booking-storage';
import { aquaparkStorage } from '@/lib/aquapark-storage';
import { saunaStorage } from '@/lib/sauna-storage';
import { notifyNewOrder } from '@/lib/order-notify';
import { notifyNewBooking } from '@/lib/booking-notify';
import { notifyReservation } from "@/lib/reservation-notify";
import type { BookingPayload } from "@/app/actions/booking";
import { notifyNewAquaparkTicket } from '@/lib/aquapark-notify';
import { notifyNewSaunaSlot } from '@/lib/sauna-notify';
import { prisma } from '@/lib/prisma';
import { hotelLabel } from '@/lib/admin-hotels';

// 'reservation' = the live Booking model (site form + admin manual booking),
// distinct from 'hotel' which is the legacy HotelBooking CRM.
export type PaymentType = 'order' | 'hotel' | 'aquapark' | 'sauna' | 'reservation';

export interface PaymentEntity {
  type: PaymentType;
  id: string;
  number: number;
  total: number; // грн
  description: string;
  successPath: string; // /…/success?id={id}
  failPath: string;
  isPaid: boolean;
}

export function encodeOrderId(type: PaymentType, id: string): string {
  return `${type}-${id}`;
}

export function decodeOrderId(orderId: string): { type: PaymentType; id: string } | null {
  const idx = orderId.indexOf('-');
  if (idx === -1) return null;
  const prefix = orderId.slice(0, idx);
  const id = orderId.slice(idx + 1);
  if (
    prefix !== 'order' &&
    prefix !== 'hotel' &&
    prefix !== 'aquapark' &&
    prefix !== 'sauna' &&
    prefix !== 'reservation'
  )
    return null;
  return { type: prefix as PaymentType, id };
}

export async function lookupEntity(type: PaymentType, id: string): Promise<PaymentEntity | null> {
  if (type === 'order') {
    const o = await orderStorage.get(id);
    if (!o) return null;
    return {
      type: 'order',
      id: o.id,
      number: o.number,
      total: o.total,
      description: `Замовлення №${o.number} — Глухомань`,
      successPath: `/menu/checkout/success?id=${o.id}`,
      failPath: `/menu/checkout/fail`,
      isPaid: o.paymentStatus === 'paid',
    };
  }
  if (type === 'hotel') {
    const b = await bookingStorage.get(id);
    if (!b) return null;
    return {
      type: 'hotel',
      id: b.id,
      number: b.number,
      total: b.total,
      description: `Бронювання №${b.number} — Готель Глухомань`,
      successPath: `/hotel/booking/success?id=${b.id}`,
      failPath: `/hotel/booking/fail`,
      isPaid: b.paymentStatus === 'paid',
    };
  }
  if (type === 'aquapark') {
    const t = await aquaparkStorage.get(id);
    if (!t) return null;
    return {
      type: 'aquapark',
      id: t.id,
      number: t.number,
      total: t.total,
      description: `Квиток в аквапарк №${t.number} — Глухомань`,
      successPath: `/aquapark/buy/success?id=${t.id}`,
      failPath: `/aquapark/buy/fail`,
      isPaid: t.paymentStatus === 'paid',
    };
  }
  if (type === 'sauna') {
    const s = await saunaStorage.get(id);
    if (!s || !s.total) return null;
    return {
      type: 'sauna',
      id: s.id,
      number: s.number,
      total: s.total,
      description: `Бронювання лазні №${s.number} — Глухомань`,
      successPath: `/sauna/booking/success?id=${s.id}`,
      failPath: `/sauna/booking/fail`,
      isPaid: s.paymentStatus === 'paid',
    };
  }
  if (type === 'reservation') {
    const b = await prisma.booking.findUnique({ where: { id } });
    if (!b || !b.totalAmount || b.totalAmount <= 0) return null;
    return {
      type: 'reservation',
      id: b.id,
      number: 0,
      total: b.totalAmount,
      description: `Бронювання — ${hotelLabel(b.hotelSlug)} (Глухомань)`,
      successPath: `/uk/pay/success?id=${b.id}`,
      failPath: `/uk/pay/${b.id}?fail=1`,
      isPaid: b.paymentStatus === 'paid',
    };
  }
  return null;
}

export async function markPaid(
  type: PaymentType,
  id: string,
  externalId?: string
): Promise<void> {
  // LiqPay can deliver the same callback more than once (S2S retries). For every
  // entity, only fire the operator notification if the row was NOT already paid
  // before this update — otherwise duplicate callbacks re-spam Telegram. (The DB
  // write itself is idempotent; only the side-effect needs guarding.)
  if (type === 'order') {
    const wasPaid = (await orderStorage.get(id))?.paymentStatus === 'paid';
    const updated = await orderStorage.updatePayment(id, 'paid', {
      status: 'PAID',
      paymentExternalId: externalId,
    });
    if (updated && !wasPaid) {
      notifyNewOrder(updated).catch(() => {});
    }
    return;
  }
  if (type === 'hotel') {
    const wasPaid = (await bookingStorage.get(id))?.paymentStatus === 'paid';
    const updated = await bookingStorage.updatePayment(id, 'paid', {
      status: 'paid',
      paymentExternalId: externalId,
    });
    if (updated && !wasPaid) {
      notifyNewBooking(updated).catch(() => {});
    }
    return;
  }
  if (type === 'aquapark') {
    const wasPaid = (await aquaparkStorage.get(id))?.paymentStatus === 'paid';
    const updated = await aquaparkStorage.updatePayment(id, 'paid', {
      status: 'paid',
      paymentExternalId: externalId,
    });
    if (updated && !wasPaid) {
      notifyNewAquaparkTicket(updated).catch(() => {});
    }
    return;
  }
  if (type === 'sauna') {
    const wasPaid = (await saunaStorage.get(id))?.paymentStatus === 'paid';
    const updated = await saunaStorage.updatePayment(id, 'paid', {
      status: 'paid',
      paymentExternalId: externalId,
    });
    if (updated && !wasPaid) {
      notifyNewSaunaSlot(updated).catch(() => {});
    }
    return;
  }
  if (type === 'reservation') {
    // Idempotency: LiqPay can deliver duplicate callbacks. Skip notify if already paid.
    const before = await prisma.booking.findUnique({ where: { id } });
    if (!before) return;
    const alreadyPaid = before.paymentStatus === 'paid';

    const b = await prisma.booking.update({
      where: { id },
      data: { status: 'CONFIRMED', paymentStatus: 'paid', paymentExternalId: externalId },
    });
    await prisma.payment.upsert({
      where: { bookingId: id },
      create: {
        provider: externalId?.startsWith('stub') ? 'stub' : 'liqpay',
        externalId, status: 'success', amount: b.totalAmount ?? 0, bookingId: id,
      },
      update: { status: 'success', externalId },
    });

    if (!alreadyPaid) {
      const payload: BookingPayload = {
        service: 'hotel',
        name: b.name, phone: b.phone, email: b.email ?? undefined,
        guests: b.guests,
        dateFrom: b.dateFrom.toISOString().slice(0, 10),
        dateTo: b.dateTo ? b.dateTo.toISOString().slice(0, 10) : undefined,
        comment: b.comment ?? undefined,
        hotelSlug: (b.hotelSlug ?? undefined) as BookingPayload['hotelSlug'],
        roomCategorySlug: b.roomCategorySlug ?? undefined,
      };
      notifyReservation(payload, b.id, { paid: true, amount: b.totalAmount ?? undefined })
        .catch((e) => console.error('[reservation] paid-notify failed', e));
    }
    return;
  }
}

export async function markFailed(type: PaymentType, id: string): Promise<void> {
  if (type === 'order') {
    await orderStorage.updatePayment(id, 'failed');
    return;
  }
  if (type === 'hotel') {
    await bookingStorage.updatePayment(id, 'failed');
    return;
  }
  if (type === 'aquapark') {
    await aquaparkStorage.updatePayment(id, 'failed');
    return;
  }
  if (type === 'sauna') {
    await saunaStorage.updatePayment(id, 'failed');
    return;
  }
  if (type === 'reservation') {
    await prisma.booking.update({
      where: { id },
      data: { paymentStatus: 'failed' },
    });
  }
}
