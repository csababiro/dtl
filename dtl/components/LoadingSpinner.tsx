import { t } from "@/lib/i18n";

export function LoadingSpinner() {
  return (
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      role="status"
      aria-label={t("common.loading")}
    />
  );
}
