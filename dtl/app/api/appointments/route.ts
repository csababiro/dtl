import { NextResponse } from "next/server";
import { getAppointmentsFromDb } from "@/lib/db/appointments";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getAppointmentsFromDb();
  return NextResponse.json({ items });
}
