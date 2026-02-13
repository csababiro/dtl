import type { WorkingHoursSchedule } from "@/lib/working-hours";
import {
  getWorkingHoursFromDb,
  putWorkingHoursInDb,
} from "@/lib/db/working-hours";
import { withDbErrorHandling } from "./errors";

export async function getWorkingHours(): Promise<
  { data: WorkingHoursSchedule } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getWorkingHoursFromDb());
}

export async function putWorkingHours(
  schedule: WorkingHoursSchedule
): Promise<
  { data: WorkingHoursSchedule } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => putWorkingHoursInDb(schedule));
}
