import type { BusinessSettings } from "@/lib/settings";
import {
  getBusinessSettingsFromDb,
  putBusinessSettingsInDb,
} from "@/lib/db/business-settings";
import { withDbErrorHandling } from "./errors";

export async function getBusinessSettings(): Promise<
  { data: BusinessSettings } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getBusinessSettingsFromDb());
}

export async function putBusinessSettings(
  payload: Partial<BusinessSettings>
): Promise<
  { data: BusinessSettings } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => putBusinessSettingsInDb(payload));
}
