import { NextResponse } from "next/server";
import type { WorkingHoursSchedule } from "@/lib/working-hours";
import { getWorkingHoursFromDb, putWorkingHoursInDb } from "@/lib/db/working-hours";

export const dynamic = "force-dynamic";

export async function GET() {
  const stored = await getWorkingHoursFromDb();
  return NextResponse.json(stored);
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as WorkingHoursSchedule;
    if (!body?.days || !Array.isArray(body.days) || body.days.length < 6) {
      return NextResponse.json(
        { error: "Invalid body; days array (length 6) required" },
        { status: 400 }
      );
    }
    const schedule: WorkingHoursSchedule = {
      days: body.days.slice(0, 6) as WorkingHoursSchedule["days"],
    };
    const stored = await putWorkingHoursInDb(schedule);
    return NextResponse.json(stored);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
