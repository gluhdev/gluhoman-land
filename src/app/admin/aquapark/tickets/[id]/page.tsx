import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Phone, User, Calendar, Mail, CreditCard, QrCode } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';
import { TicketStatusActions } from './TicketStatusActions';
import { TicketQrDisplay } from './TicketQrDisplay';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Очікує оплати',
  paid: 'Сплачено',
  used: 'Використано',
  cancelled: 'Скасовано',
  refunded: 'Повернено',
};

const PAY_LABEL: Record<string, string> = {
  pending: 'Очікує оплати',
  paid: 'Оплачено',
  failed: 'Помилка',
};

export default async function AquaparkTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await prisma.aquaparkTicket.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!ticket) notFound();

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <Link
        href="/admin/aquapark/tickets"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Назад до списку
      </Link>

      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
            Квиток в аквапарк
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1a3d2e] mt-1 tabular-nums">
            №{ticket.number}
          </h1>
          <p className="text-sm text-[#1a3d2e]/55 mt-1">
            Створено: {ticket.createdAt.toLocaleString('uk-UA', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              ticket.paymentStatus === 'paid'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                : ticket.paymentStatus === 'failed'
                ? 'bg-red-100 text-red-900 border-red-200'
                : 'bg-amber-100 text-amber-900 border-amber-200'
            }`}
          >
            {PAY_LABEL[ticket.paymentStatus] ?? ticket.paymentStatus}
          </span>
          <p className="font-display text-3xl font-semibold text-[#1a3d2e] tabular-nums">
            {formatPrice(ticket.total)}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          {/* Items */}
          <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl overflow-hidden shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
            <div className="px-6 py-4 border-b border-[#1a3d2e]/10 bg-[#f4ecd8]/30">
              <h2 className="font-display text-base font-semibold text-[#1a3d2e]">
                Квитки
              </h2>
            </div>
            <ul className="divide-y divide-[#1a3d2e]/8">
              {ticket.items.map((i) => (
                <li key={i.id} className="px-6 py-3 flex items-baseline justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#1a3d2e]">{i.name}</p>
                    <p className="text-xs text-[#1a3d2e]/55 tabular-nums">
                      {i.quantity} × {i.price} ₴
                    </p>
                  </div>
                  <p className="font-bold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                    {formatPrice(i.price * i.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="px-6 py-4 border-t border-[#1a3d2e]/10 bg-[#f4ecd8]/30 flex justify-between text-base font-bold text-[#1a3d2e]">
              <span>До сплати</span>
              <span className="tabular-nums">{formatPrice(ticket.total)}</span>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
            <h2 className="font-display text-base font-semibold text-[#1a3d2e] mb-4">Клієнт</h2>
            <div className="space-y-3">
              <DetailRow icon={<User className="h-3.5 w-3.5" />} label="Ім'я" value={ticket.customerName} />
              <DetailRow
                icon={<Phone className="h-3.5 w-3.5" />}
                label="Телефон"
                value={
                  <a href={`tel:${ticket.customerPhone}`} className="hover:underline">
                    {ticket.customerPhone}
                  </a>
                }
              />
              {ticket.customerEmail && (
                <DetailRow
                  icon={<Mail className="h-3.5 w-3.5" />}
                  label="Email"
                  value={
                    <a href={`mailto:${ticket.customerEmail}`} className="hover:underline">
                      {ticket.customerEmail}
                    </a>
                  }
                />
              )}
              <DetailRow
                icon={<Calendar className="h-3.5 w-3.5" />}
                label="Дата візиту"
                value={ticket.date.toLocaleDateString('uk-UA', { dateStyle: 'long' })}
              />
              {ticket.paymentStatus === 'paid' && (
                <DetailRow icon={<CreditCard className="h-3.5 w-3.5" />} label="Оплата" value="LiqPay" />
              )}
            </div>
          </div>

          {/* QR */}
          {ticket.qrCode && ticket.paymentStatus === 'paid' && (
            <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
              <h2 className="font-display text-base font-semibold text-[#1a3d2e] mb-4 flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR-код квитка
              </h2>
              <TicketQrDisplay qrCode={ticket.qrCode} />
              <p className="text-xs text-[#1a3d2e]/55 mt-3 font-mono break-all">{ticket.qrCode}</p>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-6 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)]">
            <h2 className="font-display text-base font-semibold text-[#1a3d2e] mb-1">Статус</h2>
            <p className="text-xs text-[#1a3d2e]/55 mb-4">
              Поточний: <strong className="text-[#1a3d2e]">{STATUS_LABEL[ticket.status] ?? ticket.status}</strong>
            </p>
            <TicketStatusActions ticketId={ticket.id} currentStatus={ticket.status} />
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
        <p className="text-[10px] uppercase tracking-wider text-[#1a3d2e]/55 font-semibold">
          {label}
        </p>
        <div className="text-[#1a3d2e]">{value}</div>
      </div>
    </div>
  );
}
