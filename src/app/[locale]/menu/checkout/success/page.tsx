import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SuccessClient } from './SuccessClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('booking.menu');
  return {
    title: t('meta_success_title'),
    robots: { index: false, follow: false },
  };
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const sp = await searchParams;
  const id = sp.id ?? '';

  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)] pt-28 md:pt-36 pb-16">
      <div className="container max-w-2xl mx-auto px-6">
        <SuccessClient orderId={id} />
      </div>
    </main>
  );
}
