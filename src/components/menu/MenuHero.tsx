import Image from 'next/image';

interface MenuHeroProps {
  totalCategories: number;
  totalItems: number;
}

export function MenuHero({ totalCategories, totalItems }: MenuHeroProps) {
  return (
    <section className="relative bg-[#0b1410] text-[#faf6ec] overflow-hidden">
      {/* Backdrop image */}
      <div className="absolute inset-0">
        <Image
          src="/images/restaurant/hall_oven.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1410]/70 via-[#0b1410]/75 to-[#0f1f18]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-28 md:pt-44 md:pb-36">
        {/* Kicker */}
        <div className="flex items-center gap-4 mb-10">
          <span className="font-display italic text-[#e6d9b8] text-lg">I</span>
          <span className="h-px w-10 bg-[#e6d9b8]/50" />
          <span className="text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8]">
            Ресторан «Глухомань»
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-[64px] md:text-[96px] lg:text-[120px] leading-[0.9] font-light tracking-tight text-[#faf6ec]">
          Меню
        </h1>
        <p className="font-display italic text-2xl md:text-3xl text-[#e6d9b8] mt-4 mb-10">
          гастрономічної подорожі
        </p>

        <div className="max-w-xl">
          <p className="text-[#faf6ec]/75 leading-relaxed text-base md:text-lg">
            Українська та європейська кухня, натхненна сезонами й локальними
            продуктами. Крафтове пиво власної пивоварні до кожної страви.
          </p>
        </div>

        {/* Stats strip */}
        <div className="mt-14 grid grid-cols-2 max-w-md gap-px bg-[#e6d9b8]/25">
          <div className="bg-[#0f1f18] px-6 py-6">
            <div className="font-display text-4xl font-light text-[#faf6ec]">
              {totalCategories}
            </div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/80 mt-1">
              категорій
            </div>
          </div>
          <div className="bg-[#0f1f18] px-6 py-6">
            <div className="font-display text-4xl font-light text-[#faf6ec]">
              {totalItems}
            </div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/80 mt-1">
              страв
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
