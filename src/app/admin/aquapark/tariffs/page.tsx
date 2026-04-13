import Link from 'next/link';
import { Plus, Eye, EyeOff, Edit2, Ticket } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';
import { toggleTariffActive } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminTariffsPage() {
  const tariffs = await prisma.aquaparkTariff.findMany({
    orderBy: { price: 'asc' },
  });

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
            Аквапарк
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
            Тарифи
          </h1>
          <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
        </div>
        <Link
          href="/admin/aquapark/tariffs/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors shadow-md"
        >
          <Plus className="h-4 w-4" />
          Новий тариф
        </Link>
      </div>

      {tariffs.length === 0 ? (
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-12 text-center">
          <Ticket className="h-12 w-12 text-[#1a3d2e]/30 mx-auto mb-3" />
          <p className="text-sm text-[#1a3d2e]/60">Ще немає тарифів</p>
        </div>
      ) : (
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl overflow-hidden shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)]">
          <ul className="divide-y divide-[#1a3d2e]/8">
            {tariffs.map((t) => (
              <li
                key={t.id}
                className={`flex items-center gap-4 px-6 py-4 hover:bg-[#1a3d2e]/4 transition-colors ${
                  !t.active ? 'opacity-50' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#1a3d2e]/8 text-[#1a3d2e] flex items-center justify-center flex-shrink-0">
                  <Ticket className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg font-semibold text-[#1a3d2e]">
                    {t.name}
                    {!t.active && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-[#1a3d2e]/50">
                        приховано
                      </span>
                    )}
                  </p>
                  {t.description && (
                    <p className="text-xs text-[#1a3d2e]/55 line-clamp-1">{t.description}</p>
                  )}
                </div>
                <p className="font-display text-xl font-semibold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                  {formatPrice(t.price)}
                </p>
                <form action={toggleTariffActive.bind(null, t.id)}>
                  <button
                    type="submit"
                    className="w-9 h-9 flex items-center justify-center rounded-full text-[#1a3d2e]/40 hover:text-[#1a3d2e] hover:bg-[#1a3d2e]/8 transition-colors"
                    aria-label={t.active ? 'Сховати' : 'Показати'}
                  >
                    {t.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </form>
                <Link
                  href={`/admin/aquapark/tariffs/${t.id}`}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-[#1a3d2e]/40 hover:text-[#1a3d2e] hover:bg-[#1a3d2e]/8 transition-colors"
                  aria-label="Редагувати"
                >
                  <Edit2 className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
