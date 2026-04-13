'use server';

/**
 * Server actions for AquaparkTariff CRUD.
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

const TariffSchema = z.object({
  name: z.string().trim().min(2, "Назва обов'язкова"),
  price: z.coerce.number().int().min(0),
  description: z.string().trim().optional(),
  active: z.coerce.boolean().default(true),
});

export async function createTariff(formData: FormData) {
  await requireAdmin();
  const parsed = TariffSchema.safeParse({
    name: formData.get('name'),
    price: formData.get('price'),
    description: formData.get('description') || undefined,
    active: formData.get('active') === 'on' || formData.get('active') === 'true',
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }
  await prisma.aquaparkTariff.create({ data: parsed.data });
  revalidatePath('/admin/aquapark');
  revalidatePath('/admin/aquapark/tariffs');
  revalidatePath('/aquapark/buy');
  redirect('/admin/aquapark/tariffs');
}

export async function updateTariff(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = TariffSchema.safeParse({
    name: formData.get('name'),
    price: formData.get('price'),
    description: formData.get('description') || undefined,
    active: formData.get('active') === 'on' || formData.get('active') === 'true',
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }
  await prisma.aquaparkTariff.update({
    where: { id },
    data: parsed.data,
  });
  revalidatePath('/admin/aquapark');
  revalidatePath('/admin/aquapark/tariffs');
  revalidatePath(`/admin/aquapark/tariffs/${id}`);
  revalidatePath('/aquapark/buy');
  redirect('/admin/aquapark/tariffs');
}

export async function deleteTariff(id: string) {
  await requireAdmin();
  // Check if any tickets reference this tariff
  const count = await prisma.aquaparkTicketItem.count({ where: { tariffId: id } });
  if (count > 0) {
    throw new Error(`Не можна видалити: ${count} квитків використовують цей тариф`);
  }
  await prisma.aquaparkTariff.delete({ where: { id } });
  revalidatePath('/admin/aquapark/tariffs');
  revalidatePath('/aquapark/buy');
  redirect('/admin/aquapark/tariffs');
}

export async function toggleTariffActive(id: string) {
  await requireAdmin();
  const tariff = await prisma.aquaparkTariff.findUnique({ where: { id } });
  if (!tariff) return;
  await prisma.aquaparkTariff.update({
    where: { id },
    data: { active: !tariff.active },
  });
  revalidatePath('/admin/aquapark/tariffs');
  revalidatePath('/aquapark/buy');
}
