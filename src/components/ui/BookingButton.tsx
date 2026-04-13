"use client";

import * as React from "react";
import { openBookingDialog } from "@/components/ui/BookingDialog";
import type { BookingService } from "@/app/actions/booking";
import { cn } from "@/lib/utils";

export interface BookingButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  service?: BookingService;
}

export const BookingButton = React.forwardRef<
  HTMLButtonElement,
  BookingButtonProps
>(({ service, className, type = "button", children, ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    onClick={() => openBookingDialog(service)}
    className={cn(className)}
    {...props}
  >
    {children}
  </button>
));
BookingButton.displayName = "BookingButton";
