/**
 * Working hours (orar) for calendar and booking.
 * Stored in localStorage (key: dtl-working-hours) when set from admin; no API yet.
 */

const STORAGE_KEY = "dtl-working-hours";

export interface WorkingHoursRange {
  start: string; // "HH:mm" e.g. "08:00"
  end: string;   // "HH:mm" e.g. "17:00"
}

const DEFAULT_RANGE: WorkingHoursRange = {
  start: "08:00",
  end: "17:00",
};

function parseTime(time: string): { hours: number; minutes: number } {
  const [h, m] = time.split(":").map(Number);
  return { hours: h ?? 0, minutes: m ?? 0 };
}

/** Get working hours from localStorage or default. Safe on server (returns default). */
export function getWorkingHours(): WorkingHoursRange {
  if (typeof window === "undefined") return DEFAULT_RANGE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RANGE;
    const parsed = JSON.parse(raw) as WorkingHoursRange;
    if (parsed?.start && parsed?.end) return parsed;
  } catch {
    /* ignore */
  }
  return DEFAULT_RANGE;
}

/** Save working hours to localStorage. Call from client only. */
export function setWorkingHours(range: WorkingHoursRange): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(range));
  } catch {
    /* ignore */
  }
}

/** Return min and max Date for a given day using current working hours. Used by calendar. */
export function getMinMaxForDay(day: Date): { min: Date; max: Date } {
  const range = getWorkingHours();
  const start = parseTime(range.start);
  const end = parseTime(range.end);
  const min = new Date(day);
  min.setHours(start.hours, start.minutes, 0, 0);
  const max = new Date(day);
  max.setHours(end.hours, end.minutes, 0, 0);
  return { min, max };
}
