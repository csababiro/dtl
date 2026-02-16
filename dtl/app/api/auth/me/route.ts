import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth/jwt";
import { canAuthManageUsers } from "@/lib/db/users";

export const dynamic = "force-dynamic";

export type AuthMeRole = "super_admin" | "admin" | "staff";

/** Returns current session { sub, role, canManageUsers? } or 401. */
export async function GET(request: Request) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = auth.role as AuthMeRole;
  const canManageUsers = await canAuthManageUsers(auth);
  return NextResponse.json(
    {
      sub: auth.sub,
      role:
        role === "super_admin" || role === "admin" || role === "staff" ? role : "admin",
      canManageUsers,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
