import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * Premium route-level preloader. Full-screen brand takeover (deep green +
 * cream + gold) with the logo and a slow gold sweep — shown by Next during
 * route navigation / server render. Pure CSS animation, no client JS.
 */
export default function Loading() {
  const t = useTranslations("loading");

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden bg-[#0b1410] text-[#f4ecd8]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* soft gold glow behind the mark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(201,169,92,0.12),transparent_62%)]"
      />

      <div className="relative flex flex-col items-center gap-9 px-6">
        <div className="relative animate-preloader-logo">
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,92,0.22),transparent_70%)] blur-2xl animate-preloader-halo"
          />
          <Image
            src="/images/logo.png"
            alt="Глухомань"
            width={220}
            height={114}
            priority
            className="relative h-20 w-auto md:h-24 drop-shadow-[0_8px_28px_rgba(0,0,0,0.55)]"
          />
        </div>

        {/* slim gold sweep track */}
        <div className="h-px w-48 overflow-hidden rounded-full bg-[#f4ecd8]/12">
          <span
            aria-hidden
            className="block h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-[#c9a95c] to-transparent animate-preloader-sweep"
          />
        </div>

        <p className="text-[11px] font-light uppercase tracking-[0.4em] text-[#f4ecd8]/65">
          {t("message")}
        </p>
      </div>
    </div>
  );
}
