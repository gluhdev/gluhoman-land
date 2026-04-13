import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ItemForm } from '../../ItemForm';
import { deleteItem, updateItem } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, categories] = await Promise.all([
    prisma.menuItem.findUnique({ where: { id } }),
    prisma.menuCategory.findMany({
      select: { id: true, name: true, icon: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  if (!item) notFound();

  const updateItemWithId = updateItem.bind(null, id);
  const deleteItemWithId = deleteItem.bind(null, id, item.categoryId);

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <Link
        href={`/admin/menu/categories/${item.categoryId}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Назад до категорії
      </Link>

      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
          Страва
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
          {item.name}
        </h1>
        <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
      </div>

      <ItemForm
        initial={item}
        categories={categories}
        action={updateItemWithId}
        submitLabel="Зберегти зміни"
      />

      <form action={deleteItemWithId} className="mt-6">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-semibold text-xs hover:bg-red-100 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Видалити страву
        </button>
      </form>
    </div>
  );
}
