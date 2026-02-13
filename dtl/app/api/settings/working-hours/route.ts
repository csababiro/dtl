import { NextResponse } from "next/server";
import type { WorkingHoursSchedule } from "@/lib/working-hours";

const DEFAULT_DAY = { start: "08:00", end: "17:00" };
const DEFAULT_SCHEDULE: WorkingHoursSchedule = {
  days: [DEFAULT_DAY, DEFAULT_DAY, DEFAULT_DAY, DEFAULT_DAY, DEFAULT_DAY, DEFAULT_DAY],
};

declare global {
  // eslint-disable-next-line no-var
  var __workingHours: WorkingHoursSchedule | undefined;
}

function getStored(): WorkingHoursSchedule {
  if (typeof globalThis !== "undefined" && globalThis.__workingHours) {
    return globalThis.__workingHours;
  }
  return DEFAULT_SCHEDULE;
}

export async function GET() {
  return NextResponse.json(getStored());
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as WorkingHoursSchedule;
    if (!body?.days || !Array.isArray(body.days) || body.days.length < 6) {
      return NextResponse.json({ error: "Invalid body; days array (length 6) required" }, { status: 400 });
    }
    const schedule: WorkingHoursSchedule = { days: body.days.slice(0, 6) as WorkingHoursSchedule["days"] };
    if (typeof globalThis !== "undefined") globalThis.__workingHours = schedule;
    return NextResponse.json(schedule);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
