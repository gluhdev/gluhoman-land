import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/ui/Preloader";
import FloatingButtons from "@/components/ui/FloatingButtons";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
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
      <body className={`${manrope.variable} font-sans antialiased`}>
        <Preloader />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <FloatingButtons />
      </body>
    </html>
  );
}
