import { Metadata } from 'next';
import Link from 'next/link';
import { XCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Помилка оплати — Глухомань',
  robots: { index: false, follow: false },
};

export default function HotelBookingFailPage() {
  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)] py-16">
      <div className="container max-w-2xl mx-auto px-6">
        <div className="bg-[#fdfaf0] border border-[#1a3d2e]/12 rounded-3xl p-10 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)] text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-[#1a3d2e] mb-3">
            Оплата не пройшла
          </h1>
          <p className="text-sm text-[#1a3d2e]/70 mb-8 max-w-md mx-auto">
            Спробуйте ще раз або зв&apos;яжіться з нами по телефону.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/hotel/booking"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors"
            >
              Спробувати знову
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#1a3d2e]/20 text-[#1a3d2e] font-semibold text-sm hover:bg-[#1a3d2e]/5 transition-colors"
            >
              На головну
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
