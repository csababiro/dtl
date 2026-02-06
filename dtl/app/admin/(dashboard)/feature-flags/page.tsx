import { t } from "@/lib/i18n";

export default function AdminFeatureFlagsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        {t("admin.featureFlags")}
      </h1>
      <p className="text-slate-600">Feature flags – placeholder.</p>
    </div>
  );
}
