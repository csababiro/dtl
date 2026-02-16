import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

export type AuthMeRole = "super_admin" | "admin" | "staff";

/** Returns current session { sub, role } or 401. */
export async function GET(request: Request) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = auth.role as AuthMeRole;
  return NextResponse.json(
    {
      sub: auth.sub,
      role:
        role === "super_admin" || role === "admin" || role === "staff" ? role : "admin",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
