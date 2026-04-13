import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ManualOrderForm } from './ManualOrderForm';

export const dynamic = 'force-dynamic';

export default async function ManualOrderPage() {
  // Load active categories with active items for the picker
  const categories = await prisma.menuCategory.findMany({
    where: { active: true },
    include: {
      items: {
        where: { active: true },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, price: true, weight: true },
      },
    },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Назад до замовлень
      </Link>

      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
          Нове замовлення
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
          Створити замовлення вручну
        </h1>
        <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
        <p className="text-sm text-[#1a3d2e]/60 mt-3 max-w-xl">
          Для замовлень, які приймаються по телефону. Замовлення зберігається відразу як <strong>сплачене</strong>.
        </p>
      </div>

      <ManualOrderForm categories={categories} />
    </div>
  );
}
