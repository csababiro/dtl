import { NextResponse } from "next/server";
import type { ContactSettings } from "@/lib/contact-settings";
import { getContactSettingsFromDb, putContactSettingsInDb } from "@/lib/db/contact-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const stored = await getContactSettingsFromDb();
  return NextResponse.json(stored);
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContactSettings>;
    const stored = await putContactSettingsInDb(body);
    return NextResponse.json(stored);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
