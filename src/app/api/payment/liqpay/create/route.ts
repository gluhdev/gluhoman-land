/**
 * POST /api/payment/liqpay/create — POLYMORPHIC payment initialization.
 *
 * Body (any one of):
 *   { entityType: 'order' | 'hotel', entityId: string }
 *   { orderId: string }                       — backwards-compat for cart checkout
 *
 * Returns one of:
 *   • { mode: 'liqpay', data, signature, endpoint, entity }
 *   • { mode: 'stub', entity }                 — STUB mode: auto-marked paid
 *   • { mode: 'already-paid', entity }
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildCheckoutPayload, isStubMode } from '@/lib/liqpay';
import {
  PaymentType,
  encodeOrderId,
  lookupEntity,
  markPaid,
} from '@/lib/payment-router';

const Schema = z
  .object({
    entityType: z.enum(['order', 'hotel', 'aquapark', 'sauna']).optional(),
    entityId: z.string().min(1).optional(),
    orderId: z.string().min(1).optional(),
  })
  .refine((v) => v.entityId || v.orderId, { message: 'entityId або orderId обов\'язкові' });

function getSiteUrl(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, '');
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Невалідний JSON' }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Невалідні дані' }, { status: 400 });
  }

  // Resolve entity type + id
  const type: PaymentType = parsed.data.entityType ?? 'order';
  const id = parsed.data.entityId ?? parsed.data.orderId!;

  const entity = await lookupEntity(type, id);
  if (!entity) {
    return NextResponse.json({ error: 'Об\'єкт не знайдено' }, { status: 404 });
  }
  if (entity.isPaid) {
    return NextResponse.json({ mode: 'already-paid', entity });
  }

  // ─── STUB MODE ───
  if (isStubMode()) {
    await markPaid(type, id, `stub-${Date.now()}`);
    return NextResponse.json({ mode: 'stub', entity });
  }

  // ─── REAL LIQPAY ───
  const siteUrl = getSiteUrl(req);
  const payload = buildCheckoutPayload({
    order_id: encodeOrderId(type, id),
    amount: entity.total,
    currency: 'UAH',
    description: entity.description,
    result_url: `${siteUrl}${entity.successPath}`,
    server_url: `${siteUrl}/api/payment/liqpay/callback`,
  });

  return NextResponse.json({ mode: 'liqpay', ...payload, entity });
}
