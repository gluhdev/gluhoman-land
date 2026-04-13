import { Metadata } from 'next';
import { BookingSuccessClient } from './BookingSuccessClient';

export const metadata: Metadata = {
  title: 'Бронювання прийнято — Глухомань',
  robots: { index: false, follow: false },
};

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
