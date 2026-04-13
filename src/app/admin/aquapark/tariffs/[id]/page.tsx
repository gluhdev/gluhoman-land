import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { TariffForm } from '../../TariffForm';
import { deleteTariff, updateTariff } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function EditTariffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tariff, useCount] = await Promise.all([
    prisma.aquaparkTariff.findUnique({ where: { id } }),
    prisma.aquaparkTicketItem.count({ where: { tariffId: id } }),
  ]);
  if (!tariff) notFound();

  const updateTariffWithId = updateTariff.bind(null, id);
  const deleteTariffWithId = deleteTariff.bind(null, id);

  return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <Link
        href="/admin/aquapark/tariffs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Назад
      </Link>

      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
          Тариф
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
          {tariff.name}
        </h1>
        <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
      </div>

      <TariffForm initial={tariff} action={updateTariffWithId} submitLabel="Зберегти зміни" />

      {useCount === 0 ? (
        <form action={deleteTariffWithId} className="mt-6">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-semibold text-xs hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Видалити тариф
          </button>
        </form>
      ) : (
        <p className="text-xs text-[#1a3d2e]/55 mt-6 italic">
          Не можна видалити: {useCount} квитків використовують цей тариф.
        </p>
      )}
    </div>
  );
}
