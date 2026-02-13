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
  await sql`UPDATE working_hours SET data = ${JSON.stringify(data)}::jsonb WHERE id = 1`;
  return { days: data.days as WorkingHoursSchedule["days"] };
}
