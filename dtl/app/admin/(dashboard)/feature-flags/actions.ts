"use server";

import type { FeatureFlags } from "@/lib/feature-flags";
import { putFeatureFlags } from "@/lib/services";

export async function saveFeatureFlagsAction(
  payload: Partial<FeatureFlags>
): Promise<{ ok: true } | { ok: false; message: string }> {
  const result = await putFeatureFlags(payload);
  if ("error" in result)
    return { ok: false, message: result.error.message };
  return { ok: true };
}
