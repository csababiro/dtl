import { NextResponse } from "next/server";
import { getAppointments } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getAppointments();
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ items: result.data });
}
