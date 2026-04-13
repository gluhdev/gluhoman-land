import Script from "next/script";

export default function Plausible() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const host = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST || "https://plausible.io";

  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src={`${host}/js/script.outbound-links.js`}
      strategy="afterInteractive"
    />
  );
}
