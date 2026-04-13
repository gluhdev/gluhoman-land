import { Metadata } from 'next';
import { BookingFlow } from './BookingFlow';

export const metadata: Metadata = {
  title: 'Бронювання готелю — Глухомань',
  description:
    'Бронювання номера в готелі «Глухомань» у с. Нижні Млини. Стандарт, Люкс, Сімейний номер. Оплата онлайн.',
};

export default function HotelBookingPage() {
  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)]">
      <div className="container max-w-5xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-10 text-center">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-2">
            Готель «Глухомань»
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1a3d2e] leading-tight">
            Бронювання номера
          </h1>
          <div className="mt-4 mx-auto h-px w-12 bg-[#1a3d2e]/40" />
          <p className="mt-4 text-sm text-[#1a3d2e]/70 max-w-xl mx-auto">
            Оберіть дати, кількість гостей і номер. Оплата онлайн через захищений шлюз LiqPay.
          </p>
        </div>

        <BookingFlow />
      </div>
    </main>
  );
}
