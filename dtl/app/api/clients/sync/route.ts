import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth/jwt";
import { syncClientsFromAppointments } from "@/lib/services";

export const dynamic = "force-dynamic";

/** POST: backfill clients from existing appointments so they appear in admin Clienți. Idempotent. */
export async function POST(request: Request) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await syncClientsFromAppointments();
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json(result.data);
}
