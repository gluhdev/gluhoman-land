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
import { notifyNewAquaparkTicket } from '@/lib/aquapark-notify';
import { notifyNewSaunaSlot } from '@/lib/sauna-notify';

export type PaymentType = 'order' | 'hotel' | 'aquapark' | 'sauna';

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
  if (prefix !== 'order' && prefix !== 'hotel' && prefix !== 'aquapark' && prefix !== 'sauna') return null;
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
  return null;
}

export async function markPaid(
  type: PaymentType,
  id: string,
  externalId?: string
): Promise<void> {
  if (type === 'order') {
    const updated = await orderStorage.updatePayment(id, 'paid', {
      status: 'PAID',
      paymentExternalId: externalId,
    });
    if (updated) {
      notifyNewOrder(updated).catch(() => {});
    }
    return;
  }
  if (type === 'hotel') {
    const updated = await bookingStorage.updatePayment(id, 'paid', {
      status: 'paid',
      paymentExternalId: externalId,
    });
    if (updated) {
      notifyNewBooking(updated).catch(() => {});
    }
    return;
  }
  if (type === 'aquapark') {
    const updated = await aquaparkStorage.updatePayment(id, 'paid', {
      status: 'paid',
      paymentExternalId: externalId,
    });
    if (updated) {
      notifyNewAquaparkTicket(updated).catch(() => {});
    }
    return;
  }
  if (type === 'sauna') {
    const updated = await saunaStorage.updatePayment(id, 'paid', {
      status: 'paid',
      paymentExternalId: externalId,
    });
    if (updated) {
      notifyNewSaunaSlot(updated).catch(() => {});
    }
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
  }
}
