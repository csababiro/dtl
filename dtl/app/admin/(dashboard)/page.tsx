import { t } from "@/lib/i18n";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        {t("admin.dashboard")}
      </h1>
      <p className="text-slate-600">Panou – placeholder.</p>
    </div>
  );
}
