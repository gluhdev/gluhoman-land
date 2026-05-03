import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("loading");
  return (
    <main
      className="min-h-[70vh] flex items-center justify-center px-4 py-16"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 text-emerald-800">
        <Loader2 className="h-10 w-10 animate-spin" aria-hidden="true" />
        <p className="text-base font-medium">{t("message")}</p>
      </div>
    </main>
  );
}
