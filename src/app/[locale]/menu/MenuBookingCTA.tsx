'use client';

import { Link } from "@/i18n/routing";
import { CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  label: string;
}

export function MenuBookingCTA({ label }: Props) {
  return (
    <Button asChild size="lg" className="gap-2">
      <Link href="/restaurant/booking">
        <CalendarCheck className="h-5 w-5" />
        {label}
      </Link>
    </Button>
  );
}
