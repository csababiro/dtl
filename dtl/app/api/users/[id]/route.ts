import { NextResponse } from "next/server";
import {
  getUserByIdFromDb,
  updateUserInDb,
  deleteUserFromDb,
} from "@/lib/db/users";
import type { DummyUserRole } from "@/lib/dummy-users";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getUserByIdFromDb(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getUserByIdFromDb(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
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
    const updated = await updateUserInDb(id, updates);
    return NextResponse.json(updated!);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = await deleteUserFromDb(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
