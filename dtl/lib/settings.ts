import { getBusinessSettings as getBusinessSettingsFromApi, getPublicSiteSettings as getPublicSiteSettingsFromApi } from "./api/settings";
import defaultSettings from "./default-business-settings.json";

export interface BusinessSettings {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  logoUrl?: string;
  hours?: Record<string, string>;
}

const DEFAULT_SETTINGS: BusinessSettings = defaultSettings as BusinessSettings;

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const result = await getBusinessSettingsFromApi();
  if ("error" in result) {
    return { ...DEFAULT_SETTINGS };
  }
  return { ...DEFAULT_SETTINGS, ...result.data };
}

/** Public site: phone, address, email, whatsapp from admin Contact panel (merged with business). Use in customer layout and pages. */
export async function getPublicSiteSettings(): Promise<BusinessSettings> {
  const result = await getPublicSiteSettingsFromApi();
  if ("error" in result) {
    return { ...DEFAULT_SETTINGS };
  }
  return { ...DEFAULT_SETTINGS, ...result.data };
}
