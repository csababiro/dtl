import type { WorkingHoursSchedule } from "@/lib/working-hours";
import { sql } from "./index";

const DEFAULT_DAY = { start: "08:00", end: "17:00" };
const DEFAULTS: WorkingHoursSchedule = {
  days: [DEFAULT_DAY, DEFAULT_DAY, DEFAULT_DAY, DEFAULT_DAY, DEFAULT_DAY, DEFAULT_DAY],
};

export async function getWorkingHoursFromDb(): Promise<WorkingHoursSchedule> {
  const { rows } = await sql`SELECT data FROM working_hours WHERE id = 1`;
  const data = rows[0]?.data as { days?: unknown } | undefined;
  if (data?.days && Array.isArray(data.days) && data.days.length >= 6) {
    return { days: data.days.slice(0, 6) as WorkingHoursSchedule["days"] };
  }
  return DEFAULTS;
}

export async function putWorkingHoursInDb(
  schedule: WorkingHoursSchedule
): Promise<WorkingHoursSchedule> {
  const data = { days: schedule.days.slice(0, 6) };
  // Upsert so save works even if schema INSERT never ran (no row id=1 yet)
  await sql`
    INSERT INTO working_hours (id, data) VALUES (1, ${JSON.stringify(data)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
  return { days: data.days as WorkingHoursSchedule["days"] };
}
