import { t } from "@/lib/i18n";

export default function AdminCalendarPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{t("admin.calendar")}</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700"
        >
          Zi
        </button>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          Săptămână
        </button>
        <button
          type="button"
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700"
        >
          Lună
        </button>
      </div>
      <div className="mt-4 flex gap-2">
        <span className="rounded bg-zinc-200 px-2 py-1 text-xs">{t("admin.pending")}</span>
        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">{t("admin.confirmed")}</span>
      </div>
      <div className="mt-6 min-h-[400px] rounded-lg border border-zinc-200 bg-white p-4">
        <p className="text-zinc-500">{t("common.loading")}</p>
      </div>
    </main>
  );
}
