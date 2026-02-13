import { NextResponse } from "next/server";
import { getAppointments } from "@/lib/appointments-store";

export async function GET() {
  const items = getAppointments();
  return NextResponse.json({ items });
}
