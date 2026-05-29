'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { isHotelSlug } from '@/lib/admin-hotels';

type Result = { ok: boolean; error?: string };

/** Only super-admins (User.hotelSlug == null) may manage staff. */
async function requireSuperAdmin(): Promise<{ id: string } | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (session.user.hotelSlug) return null; // hotel-scoped admins cannot manage staff
  return { id: session.user.id };
}

const CreateSchema = z.object({
  email: z.string().email('Невірний email'),
  password: z.string().min(8, 'Пароль мінімум 8 символів'),
  name: z.string().trim().optional(),
  hotelSlug: z.string().optional(), // '' → super-admin
});

export async function createStaff(input: {
  email: string;
  password: string;
  name?: string;
  hotelSlug?: string;
}): Promise<Result> {
  const admin = await requireSuperAdmin();
  if (!admin) return { ok: false, error: 'Немає доступу' };

  const parsed = CreateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Невірні дані' };
  }
  const { email, password, name } = parsed.data;
  const hotelSlug =
    parsed.data.hotelSlug && parsed.data.hotelSlug !== ''
      ? parsed.data.hotelSlug
      : null;
  if (hotelSlug && !isHotelSlug(hotelSlug)) {
    return { ok: false, error: 'Невідомий готель' };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: 'Користувач з таким email вже існує' };

  try {
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hash,
        name: name?.trim() || (hotelSlug ? 'Адміністратор готелю' : 'Адміністратор'),
        role: 'admin',
        hotelSlug,
      },
    });
    revalidatePath('/admin/staff');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Помилка створення' };
  }
}

export async function deleteStaff(id: string): Promise<Result> {
  const admin = await requireSuperAdmin();
  if (!admin) return { ok: false, error: 'Немає доступу' };
  if (!id) return { ok: false, error: 'Missing id' };
  if (id === admin.id) return { ok: false, error: 'Не можна видалити власний акаунт' };

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/admin/staff');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Помилка видалення' };
  }
}

export async function resetStaffPassword(
  id: string,
  password: string
): Promise<Result> {
  const admin = await requireSuperAdmin();
  if (!admin) return { ok: false, error: 'Немає доступу' };
  if (!id) return { ok: false, error: 'Missing id' };
  if (password.length < 8) return { ok: false, error: 'Пароль мінімум 8 символів' };

  try {
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id }, data: { password: hash } });
    revalidatePath('/admin/staff');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Помилка оновлення' };
  }
}
