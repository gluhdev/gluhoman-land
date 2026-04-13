/**
 * GET /api/orders/[id] — read an order by id.
 * Used by the success page to poll until paymentStatus = 'paid'.
 */

import { NextRequest, NextResponse } from 'next/server';
import { orderStorage } from '@/lib/order-storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await orderStorage.get(id);
  if (!order) {
    return NextResponse.json({ error: 'Замовлення не знайдено' }, { status: 404 });
  }
  return NextResponse.json({
    id: order.id,
    number: order.number,
    status: order.status,
    paymentStatus: order.paymentStatus,
    total: order.total,
    items: order.items,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    deliveryType: order.deliveryType,
    address: order.address,
    scheduledAt: order.scheduledAt,
    createdAt: order.createdAt,
  });
}
