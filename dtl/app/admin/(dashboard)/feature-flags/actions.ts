"use server";

import type { FeatureFlags } from "@/lib/feature-flags";
import { putFeatureFlagsInDb } from "@/lib/db/feature-flags";

export async function saveFeatureFlagsAction(
  payload: Partial<FeatureFlags>
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await putFeatureFlagsInDb(payload);
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Eroare la salvare.",
    };
  }
}
