import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Phone, User, Calendar, Mail, MessageSquare, Flame, Clock } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';
import { SAUNA_TYPE_LABEL, SaunaType } from '@/types/sauna';
import { SaunaSlotStatusActions } from './SaunaSlotStatusActions';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  reserved: 'Зарезервовано',
  paid: 'Сплачено',
  completed: 'Виконано',
  cancelled: 'Скасовано',
};

const PAY_LABEL: Record<string, string> = {
  pending: 'Очікує оплати',
  paid: 'Оплачено',
  failed: 'Помилка',
};

export default async function SaunaSlotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slot = await prisma.saunaSlot.findUnique({ where: { id } });
  if (!slot) notFound();

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <Link
        href="/admin/sauna/slots"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Назад
      </Link>

      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
            Бронювання лазні
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1a3d2e] mt-1 tabular-nums">
            №{slot.number}
          </h1>
          <p className="text-sm text-[#1a3d2e]/55 mt-1">
            Створено: {slot.createdAt.toLocaleString('uk-UA', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              slot.paymentStatus === 'paid'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                : slot.paymentStatus === 'failed'
                ? 'bg-red-100 text-red-900 border-red-200'
                : 'bg-amber-100 text-amber-900 border-amber-200'
            }`}
          >
            {PAY_LABEL[slot.paymentStatus] ?? slot.paymentStatus}
          </span>
          {slot.total !== null && (
            <p className="font-display text-3xl font-semibold text-[#1a3d2e] tabular-nums">
              {formatPrice(slot.total)}
            </p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
            <h2 className="font-display text-base font-semibold text-[#1a3d2e] mb-4">Деталі</h2>
            <div className="space-y-3">
              <DetailRow
                icon={<Flame className="h-3.5 w-3.5" />}
                label="Лазня"
                value={SAUNA_TYPE_LABEL[slot.saunaType as SaunaType]}
              />
              <DetailRow
                icon={<Calendar className="h-3.5 w-3.5" />}
                label="Дата"
                value={slot.date.toLocaleDateString('uk-UA', { dateStyle: 'long' })}
              />
              <DetailRow
                icon={<Clock className="h-3.5 w-3.5" />}
                label="Час"
                value={`${slot.startTime} — ${slot.endTime} (2 години)`}
              />
            </div>
          </div>

          <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
            <h2 className="font-display text-base font-semibold text-[#1a3d2e] mb-4">Клієнт</h2>
            <div className="space-y-3">
              <DetailRow icon={<User className="h-3.5 w-3.5" />} label="Ім'я" value={slot.customerName ?? '—'} />
              {slot.customerPhone && (
                <DetailRow
                  icon={<Phone className="h-3.5 w-3.5" />}
                  label="Телефон"
                  value={
                    <a href={`tel:${slot.customerPhone}`} className="hover:underline">
                      {slot.customerPhone}
                    </a>
                  }
                />
              )}
              {slot.customerEmail && (
                <DetailRow
                  icon={<Mail className="h-3.5 w-3.5" />}
                  label="Email"
                  value={
                    <a href={`mailto:${slot.customerEmail}`} className="hover:underline">
                      {slot.customerEmail}
                    </a>
                  }
                />
              )}
              {slot.comment && (
                <DetailRow icon={<MessageSquare className="h-3.5 w-3.5" />} label="Коментар" value={slot.comment} />
              )}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
            <h2 className="font-display text-base font-semibold text-[#1a3d2e] mb-1">Статус</h2>
            <p className="text-xs text-[#1a3d2e]/55 mb-4">
              Поточний: <strong className="text-[#1a3d2e]">{STATUS_LABEL[slot.status] ?? slot.status}</strong>
            </p>
            <SaunaSlotStatusActions slotId={slot.id} currentStatus={slot.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="w-7 h-7 rounded-lg bg-[#1a3d2e]/8 text-[#1a3d2e] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-[#1a3d2e]/55 font-semibold">{label}</p>
        <div className="text-[#1a3d2e]">{value}</div>
      </div>
    </div>
  );
}
