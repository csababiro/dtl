import { NextResponse } from "next/server";
import type { BusinessSettings } from "@/lib/settings";
import { getBusinessSettingsFromDb, putBusinessSettingsInDb } from "@/lib/db/business-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const stored = await getBusinessSettingsFromDb();
  return NextResponse.json(stored);
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Partial<BusinessSettings>;
    const stored = await putBusinessSettingsInDb(body);
    return NextResponse.json(stored);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
