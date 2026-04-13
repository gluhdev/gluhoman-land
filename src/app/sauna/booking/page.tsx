import { Metadata } from 'next';
import { SaunaBookingFlow } from './SaunaBookingFlow';

export const metadata: Metadata = {
  title: 'Бронювання лазні — Глухомань',
  description:
    'Бронювання лазні «Глухомань». Мала або велика лазня на дровах, 2-годинні слоти. Оплата онлайн.',
};

export default function SaunaBookingPage() {
  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)]">
      <div className="container max-w-5xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-10 text-center">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-2">
            Лазня «Глухомань»
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1a3d2e] leading-tight">
            Бронювання лазні
          </h1>
          <div className="mt-4 mx-auto h-px w-12 bg-[#1a3d2e]/40" />
          <p className="mt-4 text-sm text-[#1a3d2e]/70 max-w-xl mx-auto">
            Оберіть дату, час і лазню. Слот — 2 години. Оплата онлайн через захищений шлюз LiqPay.
          </p>
        </div>

        <SaunaBookingFlow />
      </div>
    </main>
  );
}
