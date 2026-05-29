import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TicketSuccessClient } from './TicketSuccessClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('booking.aquapark');
  return {
    title: t('meta_success_title'),
    robots: { index: false, follow: false },
  };
}

export default async function AquaparkBuySuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const sp = await searchParams;
  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)] pt-28 md:pt-36 pb-16">
      <div className="container max-w-2xl mx-auto px-6">
        <TicketSuccessClient ticketId={sp.id ?? ''} />
      </div>
    </main>
  );
}
