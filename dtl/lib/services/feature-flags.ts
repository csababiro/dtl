import type { FeatureFlags } from "@/lib/feature-flags";
import { getFeatureFlagsFromDb, putFeatureFlagsInDb } from "@/lib/db/feature-flags";
import { withDbErrorHandling } from "./errors";

export async function getFeatureFlags(): Promise<
  { data: FeatureFlags } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getFeatureFlagsFromDb());
}

export async function putFeatureFlags(
  payload: Partial<FeatureFlags>
): Promise<{ data: FeatureFlags } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => putFeatureFlagsInDb(payload));
}
