import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Plus, Eye, EyeOff, Trash2, Edit2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';
import { CategoryForm } from '../../CategoryForm';
import { deleteCategory, toggleItemActive, updateCategory } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.menuCategory.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      },
    },
  });

  if (!category) notFound();

  const updateCategoryWithId = updateCategory.bind(null, id);
  const deleteCategoryWithId = deleteCategory.bind(null, id);

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <Link
        href="/admin/menu"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Назад до меню
      </Link>

      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
            Категорія
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1 flex items-center gap-3">
            {category.icon && <span className="text-3xl">{category.icon}</span>}
            <span>{category.name}</span>
          </h1>
          <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
        </div>
        <Link
          href={`/admin/menu/items/new?categoryId=${id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors shadow-md"
        >
          <Plus className="h-4 w-4" />
          Додати страву
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Items list */}
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl overflow-hidden shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
          <div className="px-6 py-4 border-b border-[#1a3d2e]/10 bg-[#f4ecd8]/30 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#1a3d2e]">
              Страви
            </h2>
            <span className="text-xs font-semibold text-[#1a3d2e]/55">
              {category.items.length}
            </span>
          </div>
          {category.items.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-[#1a3d2e]/50">
              Ще немає страв.{' '}
              <Link href={`/admin/menu/items/new?categoryId=${id}`} className="underline">
                Додати першу
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[#1a3d2e]/8 max-h-[calc(100vh-300px)] overflow-y-auto">
              {category.items.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center gap-3 px-6 py-3 hover:bg-[#1a3d2e]/4 transition-colors ${
                    !item.active ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1a3d2e] truncate">
                      {item.name}
                      {!item.active && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-[#1a3d2e]/50">
                          приховано
                        </span>
                      )}
                    </p>
                    {item.weight && (
                      <p className="text-[10px] text-[#1a3d2e]/55 uppercase tracking-wider">
                        {item.weight}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                    {formatPrice(item.price)}
                  </span>
                  <form action={toggleItemActive.bind(null, item.id)}>
                    <button
                      type="submit"
                      className="w-8 h-8 flex items-center justify-center rounded-full text-[#1a3d2e]/40 hover:text-[#1a3d2e] hover:bg-[#1a3d2e]/8 transition-colors"
                      aria-label={item.active ? 'Сховати' : 'Показати'}
                    >
                      {item.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </form>
                  <Link
                    href={`/admin/menu/items/${item.id}`}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[#1a3d2e]/40 hover:text-[#1a3d2e] hover:bg-[#1a3d2e]/8 transition-colors"
                    aria-label="Редагувати"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Edit category form + delete */}
        <div className="space-y-4">
          <CategoryForm initial={category} action={updateCategoryWithId} submitLabel="Зберегти зміни" />
          <form action={deleteCategoryWithId}>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-red-50 text-red-700 border border-red-200 font-semibold text-xs hover:bg-red-100 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Видалити категорію
            </button>
            <p className="text-[10px] text-[#1a3d2e]/45 text-center mt-2">
              Видалить також усі {category.items.length} страв в цій категорії
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
