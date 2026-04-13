/**
 * GET /api/admin/export/orders?from=YYYY-MM-DD&to=YYYY-MM-DD&status=...
 * Returns CSV of orders, optionally filtered.
 */

import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildCsv, csvResponse, fmtDateTime } from '@/lib/csv';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(req.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const status = url.searchParams.get('status');

  const where: { createdAt?: { gte?: Date; lte?: Date }; status?: string } = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = toDate;
    }
  }
  if (status) where.status = status;

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  const headers = [
    '№',
    'Дата',
    'Статус',
    'Оплата',
    'Клієнт',
    'Телефон',
    'Тип',
    'Адреса',
    'Замовлено на',
    'Сума, грн',
    'Доставка, грн',
    'Усього, грн',
    'Позицій',
    'Перелік',
    'Коментар',
  ];

  const rows = orders.map((o) => [
    o.number,
    fmtDateTime(o.createdAt),
    o.status,
    o.paymentStatus,
    o.customerName,
    o.customerPhone,
    o.deliveryType === 'delivery' ? 'Доставка' : 'Самовивіз',
    o.address ?? '',
    o.scheduledAt ? fmtDateTime(o.scheduledAt) : 'якнайшвидше',
    o.subtotal,
    o.deliveryFee,
    o.total,
    o.items.length,
    o.items.map((i) => `${i.name} ×${i.quantity}`).join(' • '),
    o.comment ?? '',
  ]);

  const csv = buildCsv(headers, rows);
  const filename = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  return csvResponse(filename, csv);
}
