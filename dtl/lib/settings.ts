import { get } from "./api-client";
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
  const result = await get<BusinessSettings>("/settings/business");
  if ("error" in result) {
    return { ...DEFAULT_SETTINGS };
  }
  return { ...DEFAULT_SETTINGS, ...result.data };
}
