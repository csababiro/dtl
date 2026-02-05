import { t } from "@/lib/i18n";

export default function AdminDashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{t("admin.dashboard")}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-500">Venit (azi)</p>
          <p className="mt-1 text-xl font-semibold">—</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-500">Venit (săptămâna aceasta)</p>
          <p className="mt-1 text-xl font-semibold">—</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-500">Venit (luna aceasta)</p>
          <p className="mt-1 text-xl font-semibold">—</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-500">Servicii (azi)</p>
          <p className="mt-1 text-xl font-semibold">—</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-500">Servicii (săptămâna aceasta)</p>
          <p className="mt-1 text-xl font-semibold">—</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-500">Servicii (luna aceasta)</p>
          <p className="mt-1 text-xl font-semibold">—</p>
        </div>
      </div>
      <p className="mt-6 text-sm text-zinc-500">{t("admin.noData")}</p>
    </main>
  );
}
