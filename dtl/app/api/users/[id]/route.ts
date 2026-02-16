import { NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser, setUserPassword } from "@/lib/services";
import type { DummyUserRole } from "@/lib/dummy-users";
import { getAuthFromRequest } from "@/lib/auth/jwt";
import { canAuthManageUsers } from "@/lib/db/users";
import { hashPassword } from "@/lib/password";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await canAuthManageUsers(auth))) {
    return NextResponse.json(
      { error: "Forbidden. Doar Super Admin sau Admin cu dreptul de a gestiona utilizatorii poate accesa." },
      { status: 403 }
    );
  }
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
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await canAuthManageUsers(auth))) {
    return NextResponse.json(
      { error: "Forbidden. Doar Super Admin sau Admin cu dreptul de a gestiona utilizatorii poate accesa." },
      { status: 403 }
    );
  }
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
      password?: string;
      passwordConfirm?: string;
    };
    const password = typeof body.password === "string" ? body.password : "";
    const passwordConfirm = typeof body.passwordConfirm === "string" ? body.passwordConfirm : "";
    if (password || passwordConfirm) {
      if (password.length < 8) {
        return NextResponse.json({ error: "Parola trebuie să aibă cel puțin 8 caractere." }, { status: 400 });
      }
      if (password !== passwordConfirm) {
        return NextResponse.json({ error: "Parolele nu coincid." }, { status: 400 });
      }
    }
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
    if (password) {
      const hashed = await hashPassword(password);
      const setResult = await setUserPassword(id, hashed);
      if ("error" in setResult) {
        return NextResponse.json({ error: setResult.error.message }, { status: 500 });
      }
    }
    const updated = await getUserById(id);
    const user = "data" in updated && updated.data != null ? updated.data : result.data!;
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await canAuthManageUsers(auth))) {
    return NextResponse.json(
      { error: "Forbidden. Doar Super Admin sau Admin cu dreptul de a gestiona utilizatorii poate accesa." },
      { status: 403 }
    );
  }
  const { id } = await params;
  const result = await deleteUser(id);
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  if (!result.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
