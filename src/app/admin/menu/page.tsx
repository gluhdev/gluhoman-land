import Link from 'next/link';
import { Plus, Eye, EyeOff } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';
import { toggleCategoryActive } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminMenuPage() {
  const categories = await prisma.menuCategory.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });
  const totalItems = await prisma.menuItem.count();
  const activeItems = await prisma.menuItem.count({ where: { active: true } });
  const avgPrice = await prisma.menuItem.aggregate({ _avg: { price: true } });

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
            Меню
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
            Управління меню
          </h1>
          <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
        </div>
        <Link
          href="/admin/menu/categories/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors shadow-md"
        >
          <Plus className="h-4 w-4" />
          Нова категорія
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Stat label="Категорій" value={categories.length} />
        <Stat label="Страв" value={totalItems} hint={`${activeItems} активних`} />
        <Stat label="Середня ціна" value={formatPrice(Math.round(avgPrice._avg.price ?? 0))} />
      </div>

      <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl overflow-hidden shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)]">
        <div className="px-6 py-4 border-b border-[#1a3d2e]/10 bg-[#f4ecd8]/30">
          <h2 className="font-display text-base font-semibold text-[#1a3d2e]">
            Категорії
          </h2>
        </div>
        {categories.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[#1a3d2e]/50">
            Ще немає категорій
          </div>
        ) : (
          <ul className="divide-y divide-[#1a3d2e]/8">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={`flex items-center gap-4 px-6 py-4 hover:bg-[#1a3d2e]/4 transition-colors ${
                  !cat.active ? 'opacity-50' : ''
                }`}
              >
                {cat.icon && <span className="text-2xl flex-shrink-0">{cat.icon}</span>}
                <Link href={`/admin/menu/categories/${cat.id}`} className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a3d2e] truncate">
                    {cat.name}
                    {!cat.active && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-[#1a3d2e]/50">
                        приховано
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#1a3d2e]/55">
                    slug: {cat.slug} · order: {cat.order}
                  </p>
                </Link>
                <span className="text-xs font-semibold text-[#1a3d2e]/70 bg-[#1a3d2e]/8 px-3 py-1 rounded-full whitespace-nowrap">
                  {cat._count.items} страв
                </span>
                <form action={toggleCategoryActive.bind(null, cat.id)}>
                  <button
                    type="submit"
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[#1a3d2e]/40 hover:text-[#1a3d2e] hover:bg-[#1a3d2e]/8 transition-colors"
                    aria-label={cat.active ? 'Сховати' : 'Показати'}
                  >
                    {cat.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="bg-white border border-[#1a3d2e]/10 rounded-2xl p-5">
      <p className="text-[10px] uppercase tracking-wider font-semibold text-[#1a3d2e]/55">{label}</p>
      <p className="font-display text-3xl font-semibold text-[#1a3d2e] mt-1 tabular-nums">{value}</p>
      {hint && <p className="text-xs text-[#1a3d2e]/55 mt-1">{hint}</p>}
    </div>
  );
}
