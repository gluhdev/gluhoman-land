/**
 * GET /api/admin/export/sauna-slots?from=...&to=...&status=...
 */

import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildCsv, csvResponse, fmtDate, fmtDateTime } from '@/lib/csv';
import { SAUNA_TYPE_LABEL, SaunaType } from '@/types/sauna';

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

  const slots = await prisma.saunaSlot.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  const headers = [
    '№',
    'Створено',
    'Статус',
    'Оплата',
    'Лазня',
    'Дата',
    'Початок',
    'Кінець',
    'Клієнт',
    'Телефон',
    'Email',
    'Сума, грн',
    'Коментар',
  ];

  const rows = slots.map((s) => [
    s.number,
    fmtDateTime(s.createdAt),
    s.status,
    s.paymentStatus,
    SAUNA_TYPE_LABEL[s.saunaType as SaunaType] ?? s.saunaType,
    fmtDate(s.date),
    s.startTime,
    s.endTime,
    s.customerName ?? '',
    s.customerPhone ?? '',
    s.customerEmail ?? '',
    s.total ?? '',
    s.comment ?? '',
  ]);

  const csv = buildCsv(headers, rows);
  const filename = `sauna-slots-${new Date().toISOString().slice(0, 10)}.csv`;
  return csvResponse(filename, csv);
}
