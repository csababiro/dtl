import { getFeatureFlags } from "@/lib/feature-flags";
import AdminFeatureFlagsForm from "@/components/AdminFeatureFlagsForm";
import { t } from "@/lib/i18n";

export default async function AdminFeatureFlagsPage() {
  const flags = await getFeatureFlags();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">{t("admin.featureFlags")}</h1>
      <AdminFeatureFlagsForm flags={flags} />
    </div>
  );
}
