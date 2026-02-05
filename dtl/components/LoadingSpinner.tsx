import { t } from "@/lib/i18n";

export function LoadingSpinner() {
  return (
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600"
      role="status"
      aria-label={t("common.loading")}
    />
  );
}
