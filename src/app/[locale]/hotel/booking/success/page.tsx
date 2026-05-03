import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BookingSuccessClient } from './BookingSuccessClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('booking.hotel');
  return {
    title: t('meta_success_title'),
    robots: { index: false, follow: false },
  };
}

export default async function HotelBookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const sp = await searchParams;
  return (
    <main className="bg-[#faf6ec] min-h-[calc(100vh-6rem)] py-16">
      <div className="container max-w-2xl mx-auto px-6">
        <BookingSuccessClient bookingId={sp.id ?? ''} />
      </div>
    </main>
  );
}
