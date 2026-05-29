import Link from 'next/link';
import { CheckCircle2, Clock } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { hotelLabel } from '@/lib/admin-hotels';

export const dynamic = 'force-dynamic';

export default async function PaySuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { locale } = await params;
  const { id } = await searchParams;
  const booking = id
    ? await prisma.booking.findUnique({ where: { id } })
    : null;
  const paid = booking?.paymentStatus === 'paid';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md text-center">
        {paid ? (
          <CheckCircle2 className="h-14 w-14 text-[#1a3d2e] mx-auto" strokeWidth={1.2} />
        ) : (
          <Clock className="h-14 w-14 text-[#c9a95c] mx-auto" strokeWidth={1.2} />
        )}
        <h1 className="font-display text-4xl text-[#1a3d2e] mt-6 leading-tight">
          {paid ? 'Дякуємо за оплату!' : 'Оплата обробляється'}
        </h1>
        <div className="mx-auto mt-5 h-px w-16 bg-[#1a3d2e]/30" />
        <p className="mt-6 text-[#1a3d2e]/70 leading-relaxed">
          {paid ? (
            <>
              Ваше бронювання
              {booking?.hotelSlug ? ` у ${hotelLabel(booking.hotelSlug)}` : ''}{' '}
              підтверджено. Ми зв&apos;яжемося з вами найближчим часом. Гарного
              відпочинку в «Глухомані»!
            </>
          ) : (
            <>
              Ми очікуємо підтвердження оплати від банку. Щойно вона пройде,
              бронювання буде підтверджено автоматично.
            </>
          )}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-block mt-8 px-7 py-3 bg-[#1a3d2e] text-[#f4ecd8] text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-[#0b1410] transition-colors"
        >
          На головну
        </Link>
      </div>
    </div>
  );
}
