import { NextResponse } from "next/server";
import type { BusinessSettings } from "@/lib/settings";
import { getBusinessSettings, putBusinessSettings } from "@/lib/services";
import { getAuthFromRequest } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getBusinessSettings();
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json(result.data);
}

export async function PUT(request: Request) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as Partial<BusinessSettings>;
    const result = await putBusinessSettings(body);
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
