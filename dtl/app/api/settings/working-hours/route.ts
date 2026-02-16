import { NextResponse } from "next/server";
import type { WorkingHoursSchedule } from "@/lib/working-hours";
import { getWorkingHours, putWorkingHours } from "@/lib/services";
import { getAuthFromRequest } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getWorkingHours();
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json(result.data);
}

export async function PUT(request: Request) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    const result = await putWorkingHours(schedule);
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
