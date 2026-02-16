import { NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/lib/services";
import type { DummyUserRole } from "@/lib/dummy-users";
import { getAuthFromRequest } from "@/lib/auth/jwt";

function requireSuperAdmin(auth: { role: string } | null) {
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (auth.role !== "super_admin") {
    return NextResponse.json(
      { error: "Forbidden. Doar Super Admin poate gestiona utilizatorii." },
      { status: 403 }
    );
  }
  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromRequest(request);
  const forbidden = requireSuperAdmin(auth);
  if (forbidden) return forbidden;
  const { id } = await params;
  const result = await getUserById(id);
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  if (!result.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result.data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromRequest(request);
  const forbidden = requireSuperAdmin(auth);
  if (forbidden) return forbidden;
  const { id } = await params;
  const userResult = await getUserById(id);
  if ("error" in userResult)
    return NextResponse.json({ error: userResult.error.message }, { status: 500 });
  if (!userResult.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      role?: string;
      active?: boolean;
      canManageUsers?: boolean;
    };
    const updates: Partial<{
      name: string;
      email: string;
      role: DummyUserRole;
      active: boolean;
      canManageUsers: boolean;
    }> = {};
    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (body.email !== undefined) updates.email = String(body.email).trim().toLowerCase();
    if (body.role !== undefined) {
      if (
        body.role !== "Super Admin" &&
        body.role !== "Admin" &&
        body.role !== "Staff"
      ) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      updates.role = body.role as DummyUserRole;
    }
    if (body.active !== undefined) updates.active = Boolean(body.active);
    if (body.canManageUsers !== undefined)
      updates.canManageUsers = Boolean(body.canManageUsers);
    const result = await updateUser(id, updates);
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json(result.data!);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromRequest(request);
  const forbidden = requireSuperAdmin(auth);
  if (forbidden) return forbidden;
  const { id } = await params;
  const result = await deleteUser(id);
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  if (!result.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
