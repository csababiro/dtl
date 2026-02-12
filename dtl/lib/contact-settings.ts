/**
 * Contact settings (phone, email, address, company name) for site footer/contact.
 * Stored in localStorage; no API yet.
 */

const STORAGE_KEY = "dtl-contact-settings";

export interface ContactSettings {
  companyName: string;
  phone: string;
  email: string;
  address: string;
}

const DEFAULTS: ContactSettings = {
  companyName: "DTL Service",
  phone: "",
  email: "",
  address: "",
};

export function getContactSettings(): ContactSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<ContactSettings>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

export function setContactSettings(settings: Partial<ContactSettings>): void {
  if (typeof window === "undefined") return;
  try {
    const current = getContactSettings();
    const next = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}
