import { NextResponse } from "next/server";
import { getUsers, addUser, setUserPassword } from "@/lib/services";
import type { DummyUserRole } from "@/lib/dummy-users";
import { getAuthFromRequest } from "@/lib/auth/jwt";
import { hashPassword, verifyPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

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

export async function GET(request: Request) {
  const auth = await getAuthFromRequest(request);
  const forbidden = requireSuperAdmin(auth);
  if (forbidden) return forbidden;
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
  const auth = await getAuthFromRequest(request);
  const forbidden = requireSuperAdmin(auth);
  if (forbidden) return forbidden;
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
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const role = (
      body.role === "Admin" || body.role === "Staff" ? body.role : "Staff"
    ) as DummyUserRole;
    if (!name || !email) {
      return NextResponse.json({ error: "name and email required" }, { status: 400 });
    }
    const password = typeof body.password === "string" ? body.password.trim() : "";
    const passwordConfirm = typeof body.passwordConfirm === "string" ? body.passwordConfirm.trim() : "";
    if (password || passwordConfirm) {
      if (password.length < 8) {
        return NextResponse.json({ error: "Parola trebuie să aibă cel puțin 8 caractere." }, { status: 400 });
      }
      if (password !== passwordConfirm) {
        return NextResponse.json({ error: "Parolele nu coincid." }, { status: 400 });
      }
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
    const user = result.data;
    if (password) {
      const hashed = await hashPassword(password);
      const setResult = await setUserPassword(user.id, hashed);
      if ("error" in setResult) {
        return NextResponse.json({ error: setResult.error.message }, { status: 500 });
      }
      const updated = setResult.data;
      const storedHash = updated?.passwordHash;
      const verifyOk =
        storedHash?.startsWith("scrypt:v1:") &&
        (await verifyPassword(password, storedHash));
      if (!verifyOk) {
        return NextResponse.json(
          { error: "Parola nu a putut fi salvată corect. Încearcă din nou sau folosește Resetare parolă după creare." },
          { status: 500 }
        );
      }
    }
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
