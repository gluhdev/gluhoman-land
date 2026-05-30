"use client";

import * as React from "react";
import Link from "next/link";
import type { BookingService } from "@/app/actions/booking";
import { cn } from "@/lib/utils";

export interface BookingButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  service?: BookingService;
}

// Aquapark booking lives on an external system — always opens in a new tab.
const AQUAPARK_BOOKING_URL = "https://gluhoman.pl.ua/";

function hrefForService(service?: BookingService): string {
  switch (service) {
    case "hotel":
      return "/hotel/booking";
    case "restaurant":
      return "/restaurant/booking";
    case "sauna":
      return "/sauna/booking";
    default:
      return "/booking";
  }
}

export const BookingButton = React.forwardRef<
  HTMLAnchorElement,
  BookingButtonProps
>(({ service, className, children, ...props }, ref) => {
  if (service === "aquapark") {
    return (
      <a
        ref={ref}
        href={AQUAPARK_BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(className)}
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      ref={ref}
      href={hrefForService(service)}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
});
BookingButton.displayName = "BookingButton";
