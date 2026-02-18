import { NextResponse } from "next/server";
import { getClientByEmail } from "@/lib/services";
import { getAuthFromRequest } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

/**
 * GET /api/clients/by-email?email=...
 * Returns client by email. Allowed: (1) admin JWT, or (2) server-side with X-Internal-Secret (e.g. Cont server actions).
 */
export async function GET(request: Request) {
  const auth = await getAuthFromRequest(request);
  const internalSecret = request.headers.get("x-internal-secret");
  const allowed =
    auth ||
    (process.env.INTERNAL_API_SECRET &&
      internalSecret === process.env.INTERNAL_API_SECRET);
  if (!allowed)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim();
  if (!email)
    return NextResponse.json(
      { error: "Missing email query parameter" },
      { status: 400 }
    );

  const result = await getClientByEmail(email);
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  if (!result.data)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result.data);
}
