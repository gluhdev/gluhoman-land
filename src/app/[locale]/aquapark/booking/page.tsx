import { redirect } from "next/navigation";

// Aquapark tickets are sold by an external system. Every "book aquapark" CTA
// already points there in a new tab; this route only stays reachable via direct
// URL / old links / SEO. It used to render an internal aquapark booking form,
// which captured bookings the external system never saw (split-brain). Redirect
// it to the canonical external booking site so there is a single source of truth.
const AQUAPARK_BOOKING_URL = "https://gluhoman.pl.ua/";

// Force dynamic: redirect() to an EXTERNAL URL cannot be encoded into a static
// page, so under static prerendering the route would serve an empty 200 instead
// of redirecting. Rendering per-request makes redirect() issue a real 307.
export const dynamic = "force-dynamic";

export default function AquaparkBookingPage() {
  redirect(AQUAPARK_BOOKING_URL);
}
