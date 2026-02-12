/**
 * Working hours (orar) for calendar and booking.
 * Stored in localStorage (key: dtl-working-hours) when set from admin; no API yet.
 * Supports per-day schedule: Luni–Sâmbătă (index 0–5).
 */

const STORAGE_KEY = "dtl-working-hours";

export interface WorkingHoursRange {
  start: string; // "HH:mm" e.g. "08:00"
  end: string;   // "HH:mm" e.g. "17:00"
}

/** One day: either open (start/end) or closed. */
export type DaySchedule =
  | { start: string; end: string }
  | { closed: true };

/** Monday (0) through Saturday (5). */
export interface WorkingHoursSchedule {
  days: [DaySchedule, DaySchedule, DaySchedule, DaySchedule, DaySchedule, DaySchedule];
}

const DEFAULT_RANGE: WorkingHoursRange = {
  start: "08:00",
  end: "17:00",
};

const DEFAULT_DAY_OPEN: DaySchedule = { start: "08:00", end: "17:00" };

const DEFAULT_SCHEDULE: WorkingHoursSchedule = {
  days: [
    DEFAULT_DAY_OPEN,
    DEFAULT_DAY_OPEN,
    DEFAULT_DAY_OPEN,
    DEFAULT_DAY_OPEN,
    DEFAULT_DAY_OPEN,
    DEFAULT_DAY_OPEN,
  ],
};

function parseTime(time: string): { hours: number; minutes: number } {
  const [h, m] = time.split(":").map(Number);
  return { hours: h ?? 0, minutes: m ?? 0 };
}

function isClosed(d: DaySchedule): d is { closed: true } {
  return "closed" in d && d.closed === true;
}

/** Get working hours schedule from localStorage. Falls back to legacy single range or default. */
export function getWorkingHoursSchedule(): WorkingHoursSchedule {
  if (typeof window === "undefined") return DEFAULT_SCHEDULE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SCHEDULE;
    const parsed = JSON.parse(raw);
    if (parsed?.days && Array.isArray(parsed.days) && parsed.days.length >= 6) {
      const days = parsed.days.slice(0, 6).map((d: unknown) => {
        if (d && typeof d === "object" && "closed" in d) return { closed: true as const };
        if (d && typeof d === "object" && "start" in d && "end" in d)
          return { start: String((d as { start: string }).start), end: String((d as { end: string }).end) };
        return DEFAULT_DAY_OPEN;
      });
      return { days: days as WorkingHoursSchedule["days"] };
    }
    if (parsed?.start && parsed?.end) {
      const range = { start: parsed.start, end: parsed.end };
      return {
        days: [range, range, range, range, range, range],
      };
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_SCHEDULE;
}

/** Save working hours schedule. Call from client only. */
export function setWorkingHoursSchedule(schedule: WorkingHoursSchedule): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
  } catch {
    /* ignore */
  }
}

/** Get single range (for backward compat). Returns first open day or default. */
export function getWorkingHours(): WorkingHoursRange {
  const schedule = getWorkingHoursSchedule();
  for (const d of schedule.days) {
    if (!isClosed(d)) return d;
  }
  return DEFAULT_RANGE;
}

/** @deprecated Use setWorkingHoursSchedule. Writes same range to all Mon–Sat. */
export function setWorkingHours(range: WorkingHoursRange): void {
  setWorkingHoursSchedule({
    days: [range, range, range, range, range, range],
  });
}

/** JS getDay(): 0=Sun, 1=Mon, ..., 6=Sat. We use 1=Mon..6=Sat → index 0..5. Sunday → -1 (closed). */
function dayToIndex(day: Date): number {
  const js = day.getDay();
  if (js === 0) return -1;
  return js - 1;
}

/** Return min and max Date for a given day using that day's working hours. */
export function getMinMaxForDay(day: Date): { min: Date; max: Date } {
  const schedule = getWorkingHoursSchedule();
  const index = dayToIndex(day);
  if (index < 0) {
    const d = new Date(day);
    d.setHours(0, 0, 0, 0);
    return { min: d, max: d };
  }
  const daySchedule = schedule.days[index];
  if (isClosed(daySchedule)) {
    const d = new Date(day);
    d.setHours(0, 0, 0, 0);
    return { min: d, max: d };
  }
  const start = parseTime(daySchedule.start);
  const end = parseTime(daySchedule.end);
  const min = new Date(day);
  min.setHours(start.hours, start.minutes, 0, 0);
  const max = new Date(day);
  max.setHours(end.hours, end.minutes, 0, 0);
  return { min, max };
}
