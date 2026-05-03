import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/ui/FloatingButtons";
import BookingDialog from "@/components/ui/BookingDialog";
import { LocalBusinessJsonLd } from "@/components/seo/StructuredData";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { BuildMarker } from "@/components/dev/BuildMarker";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1a3d2e",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://gluhoman.com.ua"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  title: "Глухомань - Ресторанно-готельний комплекс",
  description: "Відпочинок для всієї родини: аквапарк, ресторан, готель та багато інших послуг в серці природи",
  keywords: "глухомань, відпочинок, аквапарк, ресторан, готель, україна",
  openGraph: {
    title: "Глухомань - Ресторанно-готельний комплекс",
    description: "Відпочинок для всієї родини: аквапарк, ресторан, готель та багато інших послуг в серці природи",
    type: "website",
    locale: "uk_UA",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${manrope.variable} ${cormorant.variable}`}>
      <head>
        <link rel="preconnect" href="https://static.shaketopay.com.ua" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://static.shaketopay.com.ua" />
        <link rel="manifest" href="/manifest.json" />
        <LocalBusinessJsonLd />
      </head>
      <body className="font-sans antialiased bg-radial-gradient-green">
        <NextIntlClientProvider messages={messages}>
          <BuildMarker />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-primary focus:shadow-lg"
          >
            Перейти до контенту
          </a>
          <SmoothScrollProvider>
            <div className="min-h-[100svh] flex flex-col prevent-horizontal-scroll">
              <Header />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </SmoothScrollProvider>
          <FloatingButtons />
          <BookingDialog />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
