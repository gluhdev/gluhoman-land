import { Metadata } from 'next';
import { SuccessClient } from './SuccessClient';

export const metadata: Metadata = {
  title: 'Замовлення прийнято — Глухомань',
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const sp = await searchParams;
  const id = sp.id ?? '';

  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)] py-16">
      <div className="container max-w-2xl mx-auto px-6">
        <SuccessClient orderId={id} />
      </div>
    </main>
  );
}
