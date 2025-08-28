'use client';

import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

interface ServiceButtonsProps {
  serviceHref: string;
}

export default function ServiceButtons({ serviceHref }: ServiceButtonsProps) {
  const handleBookingClick = () => {
    const bookingButton = document.querySelector('[data-booking-trigger]') as HTMLElement;
    if (bookingButton) {
      bookingButton.click();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Link href={serviceHref}>
        <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl py-3 text-base font-semibold shadow-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center">
          Дізнатися більше
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </Link>
      
      <button 
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl py-3 text-base font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center"
        onClick={handleBookingClick}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Забронювати
      </button>
    </div>
  );
}