/**
 * GET /api/admin/export/hotel-bookings?from=YYYY-MM-DD&to=YYYY-MM-DD&status=...
 */

import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildCsv, csvResponse, fmtDate, fmtDateTime } from '@/lib/csv';
import { getNights } from '@/types/booking';

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

  const bookings = await prisma.hotelBooking.findMany({
    where,
    include: { room: true },
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
    'Номер кімнати',
    'Тип',
    'Заїзд',
    'Виїзд',
    'Ночей',
    'Гостей',
    'Сума, грн',
    'Коментар',
  ];

  const rows = bookings.map((b) => [
    b.number,
    fmtDateTime(b.createdAt),
    b.status,
    b.paymentStatus,
    b.customerName,
    b.customerPhone,
    b.customerEmail ?? '',
    b.room?.number ?? '',
    b.room?.type ?? '',
    fmtDate(b.checkIn),
    fmtDate(b.checkOut),
    getNights(b.checkIn.toISOString(), b.checkOut.toISOString()),
    b.guests,
    b.total,
    b.comment ?? '',
  ]);

  const csv = buildCsv(headers, rows);
  const filename = `hotel-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  return csvResponse(filename, csv);
}
