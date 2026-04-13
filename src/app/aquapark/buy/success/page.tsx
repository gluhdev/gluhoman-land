import { Metadata } from 'next';
import { TicketSuccessClient } from './TicketSuccessClient';

export const metadata: Metadata = {
  title: 'Квиток оплачено — Глухомань',
  robots: { index: false, follow: false },
};

export default async function AquaparkBuySuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const sp = await searchParams;
  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)] py-16">
      <div className="container max-w-2xl mx-auto px-6">
        <TicketSuccessClient ticketId={sp.id ?? ''} />
      </div>
    </main>
  );
}
