/**
 * POST /api/payment/liqpay/callback — POLYMORPHIC LiqPay webhook.
 *
 * The order_id field is encoded as `{type}-{id}` so the same callback
 * routes status updates to orders, hotel bookings, aquapark tickets, etc.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyCallback } from '@/lib/liqpay';
import { decodeOrderId, markFailed, markPaid } from '@/lib/payment-router';

const PAID_STATUSES = new Set(['success', 'sandbox', 'subscribed', 'wait_compensation']);
const FAILED_STATUSES = new Set([
  'failure',
  'error',
  'reversed',
  'cancelled',
  'declined',
]);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const data = formData.get('data');
  const signature = formData.get('signature');

  if (typeof data !== 'string' || typeof signature !== 'string') {
    console.warn('[liqpay-callback] missing data/signature');
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const decoded = verifyCallback(data, signature);
  if (!decoded) {
    console.warn('[liqpay-callback] invalid signature');
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const orderIdRaw = typeof decoded.order_id === 'string' ? decoded.order_id : null;
  const status = typeof decoded.status === 'string' ? decoded.status : null;
  const paymentId =
    typeof decoded.payment_id === 'string' || typeof decoded.payment_id === 'number'
      ? String(decoded.payment_id)
      : undefined;

  if (!orderIdRaw || !status) {
    console.warn('[liqpay-callback] missing order_id or status', decoded);
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  // Decode polymorphic order_id (type + id)
  const decodedId = decodeOrderId(orderIdRaw);
  if (!decodedId) {
    console.warn('[liqpay-callback] cannot decode order_id:', orderIdRaw);
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  if (PAID_STATUSES.has(status)) {
    await markPaid(decodedId.type, decodedId.id, paymentId);
  } else if (FAILED_STATUSES.has(status)) {
    await markFailed(decodedId.type, decodedId.id);
  }

  return NextResponse.json({ ok: true });
}
