import { NextResponse } from "next/server";
import type { BusinessSettings } from "@/lib/settings";
import defaultSettings from "@/lib/default-business-settings.json";

const DEFAULT: BusinessSettings = defaultSettings as BusinessSettings;

declare global {
  // eslint-disable-next-line no-var
  var __businessSettings: BusinessSettings | undefined;
}

function getStored(): BusinessSettings {
  if (typeof globalThis !== "undefined" && globalThis.__businessSettings) {
    return { ...DEFAULT, ...globalThis.__businessSettings };
  }
  return { ...DEFAULT };
}

export async function GET() {
  return NextResponse.json(getStored());
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Partial<BusinessSettings>;
    const stored = { ...getStored(), ...body };
    if (typeof globalThis !== "undefined") globalThis.__businessSettings = stored;
    return NextResponse.json(stored);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
