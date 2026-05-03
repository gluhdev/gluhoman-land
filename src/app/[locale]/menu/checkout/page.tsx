import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CheckoutForm } from './CheckoutForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('booking.menu');
  return {
    title: t('meta_title'),
    description: t('meta_description'),
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage() {
  const t = await getTranslations('booking.menu');
  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)]">
      <div className="container max-w-3xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-10 text-center">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-2">
            {t('step_label')}
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1a3d2e] leading-tight">
            {t('page_title')}
          </h1>
          <div className="mt-4 mx-auto h-px w-12 bg-[#1a3d2e]/40" />
        </div>

        <CheckoutForm />
      </div>
    </main>
  );
}
