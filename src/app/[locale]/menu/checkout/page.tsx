import { Metadata } from 'next';
import { CheckoutForm } from './CheckoutForm';

export const metadata: Metadata = {
  title: 'Оформлення замовлення — Глухомань',
  description:
    'Оформлення замовлення з доставкою з ресторану «Глухомань». Оплата онлайн через LiqPay.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)]">
      <div className="container max-w-3xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-10 text-center">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-2">
            Крок 2 з 2
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1a3d2e] leading-tight">
            Оформлення замовлення
          </h1>
          <div className="mt-4 mx-auto h-px w-12 bg-[#1a3d2e]/40" />
        </div>

        <CheckoutForm />
      </div>
    </main>
  );
}
