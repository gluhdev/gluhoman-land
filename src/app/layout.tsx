import type { Metadata, Viewport } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/ui/FloatingButtons";
import BookingDialog from "@/components/ui/BookingDialog";
import { LocalBusinessJsonLd } from "@/components/seo/StructuredData";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { BuildMarker } from "@/components/dev/BuildMarker";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        <link rel="preconnect" href="https://static.shaketopay.com.ua" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://static.shaketopay.com.ua" />
        <link rel="manifest" href="/manifest.json" />
        <LocalBusinessJsonLd />
      </head>
      <body className={`${manrope.variable} ${cormorant.variable} font-sans antialiased bg-radial-gradient-green`}>
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
      </body>
    </html>
  );
}
