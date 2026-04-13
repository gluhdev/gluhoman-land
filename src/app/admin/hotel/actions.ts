'use server';

/**
 * Server actions for HotelRoom CRUD.
 */

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
}

const RoomSchema = z.object({
  number: z.string().trim().min(1, "Номер обов'язковий"),
  type: z.enum(['standard', 'lux', 'family', 'suite']),
  capacity: z.coerce.number().int().min(1).max(10),
  pricePerNight: z.coerce.number().int().min(0),
  description: z.string().trim().optional(),
  images: z.string().trim().optional(), // JSON-encoded array of URLs
  active: z.coerce.boolean().default(true),
});

function parseImages(input?: string): string {
  if (!input) return JSON.stringify([]);
  try {
    const arr = JSON.parse(input);
    if (Array.isArray(arr)) {
      return JSON.stringify(arr.filter((x) => typeof x === 'string'));
    }
  } catch {}
  return JSON.stringify([]);
}

export async function createRoom(formData: FormData) {
  await requireAdmin();
  const parsed = RoomSchema.safeParse({
    number: formData.get('number'),
    type: formData.get('type'),
    capacity: formData.get('capacity'),
    pricePerNight: formData.get('pricePerNight'),
    description: formData.get('description') || undefined,
    images: formData.get('images') || undefined,
    active: formData.get('active') === 'on' || formData.get('active') === 'true',
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }
  await prisma.hotelRoom.create({
    data: {
      ...parsed.data,
      images: parseImages(parsed.data.images),
    },
  });
  revalidatePath('/admin/hotel');
  revalidatePath('/admin/hotel/rooms');
  revalidatePath('/hotel/booking');
  redirect('/admin/hotel/rooms');
}

export async function updateRoom(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = RoomSchema.safeParse({
    number: formData.get('number'),
    type: formData.get('type'),
    capacity: formData.get('capacity'),
    pricePerNight: formData.get('pricePerNight'),
    description: formData.get('description') || undefined,
    images: formData.get('images') || undefined,
    active: formData.get('active') === 'on' || formData.get('active') === 'true',
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }
  await prisma.hotelRoom.update({
    where: { id },
    data: {
      ...parsed.data,
      images: parseImages(parsed.data.images),
    },
  });
  revalidatePath('/admin/hotel');
  revalidatePath('/admin/hotel/rooms');
  revalidatePath(`/admin/hotel/rooms/${id}`);
  revalidatePath('/hotel/booking');
  redirect('/admin/hotel/rooms');
}

export async function deleteRoom(id: string) {
  await requireAdmin();
  const activeCount = await prisma.hotelBooking.count({
    where: {
      roomId: id,
      status: { notIn: ['cancelled', 'completed'] },
    },
  });
  if (activeCount > 0) {
    throw new Error(
      `Не можна видалити: ${activeCount} активних бронювань пов'язано з цим номером. Спочатку завершіть або скасуйте їх.`
    );
  }
  const totalBookings = await prisma.hotelBooking.count({ where: { roomId: id } });
  if (totalBookings > 0) {
    // Historical bookings exist — soft-delete by archiving
    await prisma.hotelRoom.update({
      where: { id },
      data: { active: false, number: `ARCHIVED-${Date.now()}` },
    });
  } else {
    await prisma.hotelRoom.delete({ where: { id } });
  }
  revalidatePath('/admin/hotel/rooms');
  revalidatePath('/hotel/booking');
  redirect('/admin/hotel/rooms');
}

export async function toggleRoomActive(id: string) {
  await requireAdmin();
  const room = await prisma.hotelRoom.findUnique({ where: { id } });
  if (!room) return;
  await prisma.hotelRoom.update({
    where: { id },
    data: { active: !room.active },
  });
  revalidatePath('/admin/hotel/rooms');
  revalidatePath('/hotel/booking');
}
