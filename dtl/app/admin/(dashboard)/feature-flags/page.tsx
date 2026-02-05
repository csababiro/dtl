import { t } from "@/lib/i18n";

export default function AdminFeatureFlagsPage() {
  const flags = [
    { key: "tyreService", label: "Modul Anvelope" },
    { key: "carWash", label: "Modul Spălătorie" },
    { key: "generalServiceBooking", label: "Programare Service general" },
    { key: "tyreServiceBooking", label: "Programare Anvelope" },
    { key: "carWashBooking", label: "Programare Spălătorie" },
    { key: "partsOrdering", label: "Comandă piese" },
    { key: "cardInstallmentPayment", label: "Info plăți în rate" },
  ];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{t("admin.featureFlags")}</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Super Admin: activează/dezactivează. Admin: afișează/ascunde pentru clienți.
      </p>
      <ul className="mt-6 space-y-4">
        {flags.map((f) => (
          <li
            key={f.key}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4"
          >
            <span className="font-medium text-zinc-900">{f.label}</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-zinc-300" />
                Activ (Super Admin)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="rounded border-zinc-300" />
                Vizibil clienți (Admin)
              </label>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
