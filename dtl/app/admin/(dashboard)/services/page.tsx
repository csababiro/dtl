import { t } from "@/lib/i18n";

export default function AdminServicesPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{t("admin.services")}</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Servicii general, anvelope, pachete spălătorie – cu prețuri. Liste opționale pentru programare (General: Schimb ulei, Revizie, …; Anvelope: Montaj, Echilibrare, …; Spălătorie: Spălare exterior, …).
      </p>
      <section className="mt-8">
        <h2 className="text-lg font-medium text-zinc-900">{t("home.serviceGeneral")}</h2>
        <p className="mt-2 text-sm text-zinc-500">{t("admin.noData")}</p>
      </section>
      <section className="mt-8">
        <h2 className="text-lg font-medium text-zinc-900">{t("home.serviceTyre")}</h2>
        <p className="mt-2 text-sm text-zinc-500">{t("admin.noData")}</p>
      </section>
      <section className="mt-8">
        <h2 className="text-lg font-medium text-zinc-900">{t("home.serviceCarWash")}</h2>
        <p className="mt-2 text-sm text-zinc-500">{t("admin.noData")}</p>
      </section>
    </main>
  );
}
