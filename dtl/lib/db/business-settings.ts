import type { BusinessSettings } from "@/lib/settings";
import defaultSettings from "@/lib/default-business-settings.json";
import { sql } from "./index";

const DEFAULTS = defaultSettings as BusinessSettings;

export async function getBusinessSettingsFromDb(): Promise<BusinessSettings> {
  const { rows } = await sql`SELECT data FROM business_settings WHERE id = 1`;
  const data = rows[0]?.data as Record<string, unknown> | undefined;
  return { ...DEFAULTS, ...data } as BusinessSettings;
}

export async function putBusinessSettingsInDb(
  payload: Partial<BusinessSettings>
): Promise<BusinessSettings> {
  const current = await getBusinessSettingsFromDb();
  const stored = { ...current, ...payload };
  // Upsert so save works even if schema INSERT never ran (no row id=1 yet)
  await sql`
    INSERT INTO business_settings (id, data) VALUES (1, ${JSON.stringify(stored)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
  return stored;
}
