import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ItemForm } from '../../ItemForm';
import { createItem } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function NewItemPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const sp = await searchParams;
  const categories = await prisma.menuCategory.findMany({
    select: { id: true, name: true, icon: true },
    orderBy: { order: 'asc' },
  });

  const backHref = sp.categoryId ? `/admin/menu/categories/${sp.categoryId}` : '/admin/menu';

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Назад
      </Link>

      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
          Нова страва
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
          Додати страву
        </h1>
        <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
      </div>

      <ItemForm
        categories={categories}
        defaultCategoryId={sp.categoryId}
        action={createItem}
        submitLabel="Створити страву"
      />
    </div>
  );
}
