import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';

export function MenuFooter() {
  return (
    <section className="relative bg-[#0f1f18] text-[#faf6ec] py-28 md:py-36 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <span className="font-display italic text-[#e6d9b8] text-lg">II</span>
          <span className="h-px w-10 bg-[#e6d9b8]/50" />
          <span className="text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8]">
            Бронювання
          </span>
        </div>

        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[0.95] text-[#faf6ec] max-w-3xl">
          Готові скуштувати?
        </h2>
        <p className="font-display italic text-2xl md:text-3xl text-[#e6d9b8] mt-4 mb-10">
          забронюйте столик
        </p>

        <p className="max-w-xl text-[#faf6ec]/75 leading-relaxed text-base md:text-lg mb-12">
          Запрошуємо провести вечір у затишній атмосфері ресторану «Глухомань».
          Затишні зали, відкрита тераса та кухня, що пам&apos;ятає смак дому.
        </p>

        <div className="flex flex-col sm:flex-row gap-px bg-[#e6d9b8]/25 w-fit">
          <a
            href="tel:+380508503555"
            className="inline-flex items-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-8 py-5 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors hover:bg-[#faf6ec]"
          >
            <Phone className="h-4 w-4" />
            050 850 3 555
          </a>
          <Link
            href="/restaurant"
            className="inline-flex items-center gap-3 bg-[#0f1f18] text-[#e6d9b8] px-8 py-5 text-[11px] uppercase tracking-[0.22em] font-medium border border-[#e6d9b8]/40 transition-colors hover:bg-[#1a3d2e]"
          >
            Про ресторан
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
