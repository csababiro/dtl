/**
 * Business settings from API. Returns nulls when API is unavailable.
 */

import { get } from "./api-client";

export interface BusinessSettings {
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  logoUrl?: string | null;
}

const SETTINGS_PATH = "/settings/business";

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const result = await get<BusinessSettings>(SETTINGS_PATH);
  if ("error" in result) {
    return {};
  }
  return result.data ?? {};
}
