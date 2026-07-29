import type { ContactSettings } from "@/lib/contact-settings";
import { sql } from "./index";

const DEFAULTS: ContactSettings = {
  companyName: "Nexora Service Auto",
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
  // Upsert so save works even if schema INSERT never ran (no row id=1 yet)
  await sql`
    INSERT INTO contact_settings (id, data) VALUES (1, ${JSON.stringify(stored)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
  return stored;
}
