import { NextResponse } from "next/server";
import { getUsersFromDb, addUserInDb } from "@/lib/db/users";
import type { DummyUserRole } from "@/lib/dummy-users";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getUsersFromDb();
  return NextResponse.json({ items });
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
    const user = await addUserInDb({
      name,
      email,
      role,
      active: body.active !== false,
      canManageUsers: role === "Admin" ? !!body.canManageUsers : undefined,
    });
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
