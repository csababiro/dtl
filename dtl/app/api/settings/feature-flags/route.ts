import { NextResponse } from "next/server";
import type { FeatureFlags } from "@/lib/feature-flags";
import { getFeatureFlags, putFeatureFlags } from "@/lib/services";
import { getAuthFromRequest } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getFeatureFlags();
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json(result.data, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as Partial<FeatureFlags>;
    const result = await putFeatureFlags(body);
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
