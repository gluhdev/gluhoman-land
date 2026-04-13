import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const year = Number(sp.get('year'));
  const month = Number(sp.get('month'));
  const guests = Math.max(1, Number(sp.get('guests') ?? 1));

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: 'invalid year/month' }, { status: 400 });
  }

  const firstDay = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 1);
  const daysInMonth = new Date(year, month, 0).getDate();

  const [rooms, bookings] = await Promise.all([
    prisma.hotelRoom.findMany({
      where: { active: true, capacity: { gte: guests } },
      select: { id: true },
    }),
    prisma.hotelBooking.findMany({
      where: {
        status: { notIn: ['cancelled', 'completed'] },
        AND: [{ checkIn: { lt: monthEnd } }, { checkOut: { gt: firstDay } }],
      },
      select: { roomId: true, checkIn: true, checkOut: true },
    }),
  ]);

  const totalRooms = rooms.length;
  const roomIds = new Set(rooms.map((r) => r.id));

  // For each day in the month, count how many of the relevant rooms are booked
  const days: { date: string; availableRooms: number }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStart = new Date(year, month - 1, d);
    const dayEnd = new Date(year, month - 1, d + 1);
    const occupied = new Set<string>();
    for (const b of bookings) {
      if (!roomIds.has(b.roomId)) continue;
      if (b.checkIn < dayEnd && b.checkOut > dayStart) {
        occupied.add(b.roomId);
      }
    }
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ date: iso, availableRooms: totalRooms - occupied.size });
  }

  return NextResponse.json({ year, month, totalRooms, days });
}
