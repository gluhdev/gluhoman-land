import { Metadata } from 'next';
import { aquaparkStorage } from '@/lib/aquapark-storage';
import { BuyFlow } from './BuyFlow';

export const metadata: Metadata = {
  title: 'Квитки в аквапарк — Глухомань',
  description:
    'Купівля квитків в аквапарк «Глухомань» онлайн. Дорослі, дитячі, сімейні тарифи. QR-код приходить миттєво.',
};

export default async function AquaparkBuyPage() {
  const tariffs = await aquaparkStorage.listTariffs(true);

  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)]">
      <div className="container max-w-5xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-10 text-center">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-2">
            Аквапарк «Глухомань»
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1a3d2e] leading-tight">
            Купити квиток онлайн
          </h1>
          <div className="mt-4 mx-auto h-px w-12 bg-[#1a3d2e]/40" />
          <p className="mt-4 text-sm text-[#1a3d2e]/70 max-w-xl mx-auto">
            Оберіть дату візиту і кількість квитків. Після оплати ви отримаєте QR-код, який покажете на вході.
          </p>
        </div>

        <BuyFlow tariffs={tariffs} />
      </div>
    </main>
  );
}
