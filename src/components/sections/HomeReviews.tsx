"use client";

import { Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Ірина К.",
    rating: 5,
    date: "Березень 2026",
    text:
      "Повернулися вже втретє. Готель, ресторан, аквапарк — все на одному рівні. Особлива подяка шефу за качку з яблуками і персоналу, який памʼятав нас з минулого візиту.",
  },
  {
    name: "Олексій і Марія",
    rating: 5,
    date: "Лютий 2026",
    text:
      "Святкували річницю весілля. Номер «Люкс» з видом на ставок, вечеря на терасі, лазня на дровах — незабутньо. Їхали з Харкова саме сюди і не пожалкували ні секунди.",
  },
  {
    name: "Віталій М.",
    rating: 5,
    date: "Лютий 2026",
    text:
      "Проводили корпоратив для 40 людей. Банкетна зала, анімація, пивоварня з дегустацією — усе зроблено без жодної затримки. Команда організованa бездоганно.",
  },
  {
    name: "Катерина С.",
    rating: 5,
    date: "Січень 2026",
    text:
      "Приїхали з дітьми (3 і 7 років) на зимові канікули. Аквапарк працював, у ресторані дитяче меню, тепла сімейна кімната в готелі. Діти у захваті, ми відпочили.",
  },
  {
    name: "Наталія Р.",
    rating: 5,
    date: "Січень 2026",
    text:
      "Лазня на дровах з карпатськими травами — окрема пісня. Такого глибокого відпочинку я не отримувала давно. Чайна кімната з самоваром — родзинка. Обовʼязково приїдемо ще.",
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Оцінка ${rating} з 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          strokeWidth={1.5}
          fill={i < rating ? "#c9a95c" : "transparent"}
          color="#c9a95c"
        />
      ))}
    </div>
  );
}

export default function HomeReviews() {
  const averageRating = 4.9;
  const totalReviews = 243;

  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-[#faf6ec] py-24 md:py-32 border-t border-[#1a3d2e]/10"
    >
      <div className="container mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Header */}
        <div className="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a95c]">
              Голоси гостей
            </p>
            <h2 className="mt-4 font-display text-4xl text-[#1a3d2e] md:text-6xl leading-[1.05]">
              Що кажуть про
              <span className="italic text-[#1a3d2e]/80"> «Глухомань»</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-6xl text-[#1a3d2e] md:text-7xl leading-none">
                {averageRating}
              </span>
              <div className="flex flex-col gap-1.5">
                <StarRow rating={5} />
                <span className="text-xs text-[#1a3d2e]/60">
                  {totalReviews}+ відгуків
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews — horizontal scroll on mobile, grid on desktop */}
        <div
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 -mx-6 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-5 md:overflow-visible md:mx-0 md:px-0 md:pb-0 md:gap-5"
        >
          {REVIEWS.map((r, i) => (
            <article
              key={i}
              className="w-[82vw] max-w-[340px] flex-shrink-0 snap-center md:w-auto md:max-w-none md:flex-shrink bg-white border border-[#1a3d2e]/10 p-6 md:p-7 flex flex-col gap-4 rounded-sm"
            >
              <div className="flex items-center justify-between">
                <StarRow rating={r.rating} />
                <span className="text-[10px] uppercase tracking-wider text-[#1a3d2e]/45">
                  {r.date}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#1a3d2e]/80 flex-1">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-[#1a3d2e]/10">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#1a3d2e] text-[#faf6ec] text-xs font-semibold">
                  {r.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-[#1a3d2e]">
                  {r.name}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Swipe hint on mobile */}
        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/50 md:hidden">
          ← свайп →
        </p>
      </div>
    </section>
  );
}
