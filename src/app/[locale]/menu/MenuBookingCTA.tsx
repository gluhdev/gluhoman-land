'use client';

import { CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openBookingDialog } from '@/components/ui/BookingDialog';

interface Props {
  label: string;
}

export function MenuBookingCTA({ label }: Props) {
  return (
    <Button
      size="lg"
      onClick={() => openBookingDialog('restaurant')}
      className="gap-2"
    >
      <CalendarCheck className="h-5 w-5" />
      {label}
    </Button>
  );
}
