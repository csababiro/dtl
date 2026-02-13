import type { ContactSettings } from "@/lib/contact-settings";
import {
  getContactSettingsFromDb,
  putContactSettingsInDb,
} from "@/lib/db/contact-settings";
import { withDbErrorHandling } from "./errors";

export async function getContactSettings(): Promise<
  { data: ContactSettings } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getContactSettingsFromDb());
}

export async function putContactSettings(
  payload: Partial<ContactSettings>
): Promise<
  { data: ContactSettings } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => putContactSettingsInDb(payload));
}
