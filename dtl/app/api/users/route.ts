import { NextResponse } from "next/server";
import { getUsers, addUser } from "@/lib/services";
import type { DummyUserRole } from "@/lib/dummy-users";

export const dynamic = "force-dynamic";

export async function GET() {
  // #region agent log
  fetch("http://127.0.0.1:7244/ingest/38291e03-8924-411d-af90-c560fa478f53", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "app/api/users/route.ts:GET",
      message: "GET /api/users entry",
      data: {},
      timestamp: Date.now(),
      hypothesisId: "C",
    }),
  }).catch(() => {});
  // #endregion
  const result = await getUsers();
  // #region agent log
  fetch("http://127.0.0.1:7244/ingest/38291e03-8924-411d-af90-c560fa478f53", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "app/api/users/route.ts:GET",
      message: "after getUsers()",
      data: { hasError: "error" in result, hasData: "data" in result },
      timestamp: Date.now(),
      hypothesisId: "C",
    }),
  }).catch(() => {});
  // #endregion
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ items: result.data });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      role?: string;
      active?: boolean;
      canManageUsers?: boolean;
    };
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const role = (
      body.role === "Admin" || body.role === "Staff" ? body.role : "Staff"
    ) as DummyUserRole;
    if (!name || !email) {
      return NextResponse.json({ error: "name and email required" }, { status: 400 });
    }
    const result = await addUser({
      name,
      email,
      role,
      active: body.active !== false,
      canManageUsers: role === "Admin" ? !!body.canManageUsers : undefined,
    });
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json(result.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
