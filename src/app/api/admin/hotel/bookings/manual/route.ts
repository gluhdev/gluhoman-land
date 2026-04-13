import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const ManualSchema = z.object({
  roomId: z.string().min(1),
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  customerEmail: z.string().email().optional().or(z.literal('')),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.coerce.number().int().min(1).max(10),
  comment: z.string().max(500).optional(),
  paymentMode: z.enum(['online', 'cash', 'paid-offline']),
});

const STARTING_NUMBER = 5001;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = ManualSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  const checkIn = new Date(d.checkIn);
  const checkOut = new Date(d.checkOut);
  if (checkOut.getTime() <= checkIn.getTime()) {
    return NextResponse.json({ error: 'Дата виїзду має бути пізніше дати заїзду' }, { status: 400 });
  }

  const booking = await prisma.$transaction(async (tx) => {
    const room = await tx.hotelRoom.findUnique({ where: { id: d.roomId } });
    if (!room) throw new Error('Номер не знайдено');
    if (room.capacity < d.guests) throw new Error('Цей номер не вміщує таку кількість гостей');

    const conflict = await tx.hotelBooking.findFirst({
      where: {
        roomId: d.roomId,
        status: { notIn: ['cancelled', 'completed'] },
        AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
      },
    });
    if (conflict) throw new Error('На ці дати номер вже заброньовано');

    const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000));
    const total = nights * room.pricePerNight;

    const last = await tx.hotelBooking.findFirst({
      orderBy: { number: 'desc' },
      select: { number: true },
    });
    const nextNumber = (last?.number ?? STARTING_NUMBER - 1) + 1;

    const status = d.paymentMode === 'online' ? 'pending' : 'confirmed';
    const paymentStatus = d.paymentMode === 'online' ? 'pending' : 'paid';

    return tx.hotelBooking.create({
      data: {
        number: nextNumber,
        roomId: d.roomId,
        customerName: d.customerName,
        customerPhone: d.customerPhone,
        customerEmail: d.customerEmail || null,
        checkIn,
        checkOut,
        guests: d.guests,
        total,
        status,
        paymentStatus,
        comment: d.comment || null,
      },
      include: { room: true },
    });
  }).catch((e: Error) => {
    return { error: e.message };
  });

  if ('error' in booking) {
    return NextResponse.json({ error: booking.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, booking });
}
