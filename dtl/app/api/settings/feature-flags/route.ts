import { NextResponse } from "next/server";
import type { FeatureFlags } from "@/lib/feature-flags";
import { getFeatureFlagsFromDb, putFeatureFlagsInDb } from "@/lib/db/feature-flags";

export const dynamic = "force-dynamic";

export async function GET() {
  const stored = await getFeatureFlagsFromDb();
  return NextResponse.json(stored, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Partial<FeatureFlags>;
    const stored = await putFeatureFlagsInDb(body);
    return NextResponse.json(stored);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
