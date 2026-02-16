import { AdminFeatureFlagsClient } from "@/components/admin/AdminFeatureFlagsClient";
import { getFeatureFlags } from "@/lib/services/feature-flags";
import { DEFAULT_FEATURE_FLAGS, featureFlagsToToggles } from "@/lib/feature-flags";

export default async function AdminFeatureFlagsPage() {
  const result = await getFeatureFlags();
  const flags = "data" in result ? result.data : DEFAULT_FEATURE_FLAGS;
  const initialToggles = featureFlagsToToggles({ ...DEFAULT_FEATURE_FLAGS, ...flags });
  return <AdminFeatureFlagsClient initialToggles={initialToggles} />;
}
