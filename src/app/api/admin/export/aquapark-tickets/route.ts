/**
 * GET /api/admin/export/aquapark-tickets?from=...&to=...&status=...
 */

import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildCsv, csvResponse, fmtDate, fmtDateTime } from '@/lib/csv';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response('Unauthorized', { status: 401 });

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

  const tickets = await prisma.aquaparkTicket.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  const headers = [
    '№',
    'Створено',
    'Статус',
    'Оплата',
    'Клієнт',
    'Телефон',
    'Email',
    'Дата візиту',
    'Квитки',
    'Кількість',
    'Сума, грн',
    'QR-код',
  ];

  const rows = tickets.map((t) => {
    const totalQty = t.items.reduce((s, i) => s + i.quantity, 0);
    return [
      t.number,
      fmtDateTime(t.createdAt),
      t.status,
      t.paymentStatus,
      t.customerName,
      t.customerPhone,
      t.customerEmail ?? '',
      fmtDate(t.date),
      t.items.map((i) => `${i.name} ×${i.quantity}`).join(' • '),
      totalQty,
      t.total,
      t.qrCode ?? '',
    ];
  });

  const csv = buildCsv(headers, rows);
  const filename = `aquapark-tickets-${new Date().toISOString().slice(0, 10)}.csv`;
  return csvResponse(filename, csv);
}
