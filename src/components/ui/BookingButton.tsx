"use client";

import * as React from "react";
import Link from "next/link";
import type { BookingService } from "@/app/actions/booking";
import { cn } from "@/lib/utils";

export interface BookingButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  service?: BookingService;
}

function hrefForService(service?: BookingService): string {
  switch (service) {
    case "hotel":
      return "/hotel/booking";
    case "restaurant":
      return "/restaurant/booking";
    case "aquapark":
      return "/aquapark/booking";
    case "sauna":
      return "/sauna/booking";
    default:
      return "/booking";
  }
}

export const BookingButton = React.forwardRef<
  HTMLAnchorElement,
  BookingButtonProps
>(({ service, className, children, ...props }, ref) => (
  <Link
    ref={ref}
    href={hrefForService(service)}
    className={cn(className)}
    {...props}
  >
    {children}
  </Link>
));
BookingButton.displayName = "BookingButton";
