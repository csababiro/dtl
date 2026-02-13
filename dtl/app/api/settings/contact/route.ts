import { NextResponse } from "next/server";
import type { ContactSettings } from "@/lib/contact-settings";

const DEFAULTS: ContactSettings = {
  companyName: "DTL Service",
  phone: "",
  email: "",
  address: "",
};

declare global {
  // eslint-disable-next-line no-var
  var __contactSettings: ContactSettings | undefined;
}

function getStored(): ContactSettings {
  if (typeof globalThis !== "undefined" && globalThis.__contactSettings) {
    return { ...DEFAULTS, ...globalThis.__contactSettings };
  }
  return { ...DEFAULTS };
}

export async function GET() {
  return NextResponse.json(getStored());
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContactSettings>;
    const stored = { ...getStored(), ...body };
    if (typeof globalThis !== "undefined") globalThis.__contactSettings = stored;
    return NextResponse.json(stored);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
