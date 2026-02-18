import type { ContactSettings } from "@/lib/contact-settings";
import { sql } from "./index";

const DEFAULTS: ContactSettings = {
  companyName: "DTL Service",
  phone: "",
  email: "",
  address: "",
  whatsapp: "",
};

export async function getContactSettingsFromDb(): Promise<ContactSettings> {
  const { rows } = await sql`SELECT data FROM contact_settings WHERE id = 1`;
  const data = rows[0]?.data as Record<string, unknown> | undefined;
  return { ...DEFAULTS, ...data } as ContactSettings;
}

export async function putContactSettingsInDb(
  payload: Partial<ContactSettings>
): Promise<ContactSettings> {
  const current = await getContactSettingsFromDb();
  const stored = { ...current, ...payload };
  await sql`UPDATE contact_settings SET data = ${JSON.stringify(stored)}::jsonb WHERE id = 1`;
  return stored;
}
