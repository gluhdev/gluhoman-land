'use server';

/**
 * Server actions for Menu CRUD (categories + items).
 *
 * All actions:
 *  - Verify admin session
 *  - Validate input via zod
 *  - Mutate via Prisma
 *  - revalidatePath the affected admin pages + public /menu
 *  - Return { ok, error?, redirectTo? } or redirect()
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

function makeSlug(input: string): string {
  // Cyrillic → latin transliteration (simple) + lowercase + dashes
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ie',
    ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'i', й: 'i', к: 'k', л: 'l',
    м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '',
    ю: 'iu', я: 'ia', "'": '', "ʼ": '',
  };
  return input
    .toLowerCase()
    .split('')
    .map((c) => map[c] ?? c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/* ─── CATEGORY ACTIONS ─── */

const CategorySchema = z.object({
  name: z.string().trim().min(2, "Назва обов'язкова"),
  icon: z.string().trim().max(8).optional(),
  order: z.coerce.number().int().min(0).default(0),
  active: z.coerce.boolean().default(true),
});

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const parsed = CategorySchema.safeParse({
    name: formData.get('name'),
    icon: formData.get('icon') || undefined,
    order: formData.get('order') || 0,
    active: formData.get('active') === 'on' || formData.get('active') === 'true',
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }
  const slug = makeSlug(parsed.data.name);
  let unique = slug;
  let i = 1;
  while (await prisma.menuCategory.findUnique({ where: { slug: unique } })) {
    unique = `${slug}-${i++}`;
  }
  await prisma.menuCategory.create({
    data: { ...parsed.data, slug: unique },
  });
  revalidatePath('/admin/menu');
  revalidatePath('/menu');
  redirect('/admin/menu');
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = CategorySchema.safeParse({
    name: formData.get('name'),
    icon: formData.get('icon') || undefined,
    order: formData.get('order') || 0,
    active: formData.get('active') === 'on' || formData.get('active') === 'true',
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }
  await prisma.menuCategory.update({
    where: { id },
    data: parsed.data,
  });
  revalidatePath('/admin/menu');
  revalidatePath(`/admin/menu/categories/${id}`);
  revalidatePath('/menu');
  redirect('/admin/menu');
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  // Cascades delete items via schema
  await prisma.menuCategory.delete({ where: { id } });
  revalidatePath('/admin/menu');
  revalidatePath('/menu');
  redirect('/admin/menu');
}

export async function toggleCategoryActive(id: string) {
  await requireAdmin();
  const cat = await prisma.menuCategory.findUnique({ where: { id } });
  if (!cat) return;
  await prisma.menuCategory.update({
    where: { id },
    data: { active: !cat.active },
  });
  revalidatePath('/admin/menu');
  revalidatePath('/menu');
}

/* ─── ITEM ACTIONS ─── */

const ItemSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().trim().min(2, "Назва обов'язкова"),
  description: z.string().trim().optional(),
  price: z.coerce.number().int().min(0),
  weight: z.string().trim().optional(),
  image: z.string().trim().optional(),
  order: z.coerce.number().int().min(0).default(0),
  active: z.coerce.boolean().default(true),
});

export async function createItem(formData: FormData) {
  await requireAdmin();
  const parsed = ItemSchema.safeParse({
    categoryId: formData.get('categoryId'),
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    price: formData.get('price'),
    weight: formData.get('weight') || undefined,
    image: formData.get('image') || undefined,
    order: formData.get('order') || 0,
    active: formData.get('active') === 'on' || formData.get('active') === 'true',
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }
  const slug = makeSlug(parsed.data.name);
  let unique = slug;
  let i = 1;
  while (await prisma.menuItem.findUnique({ where: { slug: unique } })) {
    unique = `${slug}-${i++}`;
  }
  await prisma.menuItem.create({
    data: { ...parsed.data, slug: unique },
  });
  revalidatePath('/admin/menu');
  revalidatePath(`/admin/menu/categories/${parsed.data.categoryId}`);
  revalidatePath('/menu');
  redirect(`/admin/menu/categories/${parsed.data.categoryId}`);
}

export async function updateItem(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = ItemSchema.safeParse({
    categoryId: formData.get('categoryId'),
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    price: formData.get('price'),
    weight: formData.get('weight') || undefined,
    image: formData.get('image') || undefined,
    order: formData.get('order') || 0,
    active: formData.get('active') === 'on' || formData.get('active') === 'true',
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }
  await prisma.menuItem.update({
    where: { id },
    data: parsed.data,
  });
  revalidatePath('/admin/menu');
  revalidatePath(`/admin/menu/categories/${parsed.data.categoryId}`);
  revalidatePath(`/admin/menu/items/${id}`);
  revalidatePath('/menu');
  redirect(`/admin/menu/categories/${parsed.data.categoryId}`);
}

export async function deleteItem(id: string, categoryId: string) {
  await requireAdmin();
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath('/admin/menu');
  revalidatePath(`/admin/menu/categories/${categoryId}`);
  revalidatePath('/menu');
  redirect(`/admin/menu/categories/${categoryId}`);
}

export async function toggleItemActive(id: string) {
  await requireAdmin();
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) return;
  await prisma.menuItem.update({
    where: { id },
    data: { active: !item.active },
  });
  revalidatePath('/admin/menu');
  revalidatePath(`/admin/menu/categories/${item.categoryId}`);
  revalidatePath('/menu');
}
