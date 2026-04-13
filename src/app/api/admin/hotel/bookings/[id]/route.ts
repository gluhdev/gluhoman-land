import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const EditSchema = z.object({
  roomId: z.string().optional(),
  customerName: z.string().min(2).optional(),
  customerPhone: z.string().min(6).optional(),
  customerEmail: z.string().email().optional().or(z.literal('')).nullable(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  guests: z.coerce.number().int().min(1).max(10).optional(),
  comment: z.string().max(500).optional().nullable(),
});

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const parsed = EditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.hotelBooking.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (existing.status === 'completed' || existing.status === 'cancelled') {
    return NextResponse.json(
      { error: 'Бронювання завершене або скасоване — редагувати не можна' },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = {};
  const d = parsed.data;
  if (d.roomId !== undefined) data.roomId = d.roomId;
  if (d.customerName !== undefined) data.customerName = d.customerName;
  if (d.customerPhone !== undefined) data.customerPhone = d.customerPhone;
  if (d.customerEmail !== undefined) data.customerEmail = d.customerEmail === '' ? null : d.customerEmail;
  if (d.checkIn !== undefined) data.checkIn = new Date(d.checkIn);
  if (d.checkOut !== undefined) data.checkOut = new Date(d.checkOut);
  if (d.guests !== undefined) data.guests = d.guests;
  if (d.comment !== undefined) data.comment = d.comment ?? null;

  // Recalc total if dates or room changed
  if (data.checkIn || data.checkOut || data.roomId) {
    const roomId = (data.roomId as string | undefined) ?? existing.roomId;
    const ci = (data.checkIn as Date | undefined) ?? existing.checkIn;
    const co = (data.checkOut as Date | undefined) ?? existing.checkOut;
    if (co.getTime() <= ci.getTime()) {
      return NextResponse.json({ error: 'Некоректні дати' }, { status: 400 });
    }
    const room = await prisma.hotelRoom.findUnique({ where: { id: roomId } });
    if (!room) return NextResponse.json({ error: 'room not found' }, { status: 400 });

    // Ensure no overlap with other active bookings
    const conflict = await prisma.hotelBooking.findFirst({
      where: {
        id: { not: id },
        roomId,
        status: { notIn: ['cancelled', 'completed'] },
        AND: [{ checkIn: { lt: co } }, { checkOut: { gt: ci } }],
      },
    });
    if (conflict) {
      return NextResponse.json(
        { error: 'На ці дати вже є інше бронювання цього номера' },
        { status: 409 }
      );
    }

    const nights = Math.max(1, Math.round((co.getTime() - ci.getTime()) / 86400000));
    data.total = nights * room.pricePerNight;
  }

  const updated = await prisma.hotelBooking.update({
    where: { id },
    data,
    include: { room: true },
  });

  return NextResponse.json({ ok: true, booking: updated });
}
