import { t } from "@/lib/i18n";

// Mock data until API exists
const MOCK_REVENUE = { daily: "—", weekly: "—", monthly: "—" };
const MOCK_VOLUME = { daily: "—", weekly: "—", monthly: "—" };

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">{t("admin.dashboard")}</h1>
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="border rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Venit (zi)</h2>
          <p className="text-xl font-semibold">{MOCK_REVENUE.daily}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Venit (săptămână)</h2>
          <p className="text-xl font-semibold">{MOCK_REVENUE.weekly}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Venit (lună)</h2>
          <p className="text-xl font-semibold">{MOCK_REVENUE.monthly}</p>
        </div>
      </section>
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Servicii (zi)</h2>
          <p className="text-xl font-semibold">{MOCK_VOLUME.daily}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Servicii (săptămână)</h2>
          <p className="text-xl font-semibold">{MOCK_VOLUME.weekly}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Servicii (lună)</h2>
          <p className="text-xl font-semibold">{MOCK_VOLUME.monthly}</p>
        </div>
      </section>
    </div>
  );
}
