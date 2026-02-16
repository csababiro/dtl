import { NextResponse } from "next/server";
import { JWT_COOKIE, signJwt } from "@/lib/auth/jwt";
import { getUserByEmailFromDb, getPasswordHashByEmailFromDb } from "@/lib/db/users";
import { verifyPassword } from "@/lib/password";

const COOKIE_MAX_AGE_SEC = 24 * 60 * 60; // 1 day

export type JwtRole = "super_admin" | "admin" | "staff";

/** Only env ADMIN_EMAIL gets super_admin; DB users get admin or staff by role. */
function resolveRole(email: string, dbRole: string | undefined): JwtRole {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail && email === adminEmail) return "super_admin";
  if (dbRole === "Staff") return "staff";
  return "admin"; // "Super Admin" and "Admin" both get JWT role admin
}

export async function POST(request: Request) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();

    const body = (await request.json()) as { email?: string; password?: string };
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "").trim();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    let role: JwtRole;
    let sub: string;

    if (adminEmail && adminPassword != null && adminPassword.length > 0 && email === adminEmail && password === adminPassword) {
      role = "super_admin";
      sub = email;
    } else {
      const user = await getUserByEmailFromDb(email);
      const isDev = process.env.NODE_ENV === "development";
      if (!user) {
        if (isDev) console.log("[login] DB user not found for email:", email);
        const body: { error: string; reason?: string } = { error: "Invalid credentials" };
        if (isDev) body.reason = "user_not_found";
        return NextResponse.json(body, { status: 401 });
      }
      if (!user.active) {
        const body: { error: string; reason?: string } = { error: "Cont dezactivat" };
        if (isDev) body.reason = "account_disabled";
        return NextResponse.json(body, { status: 401 });
      }
      const passwordRow = await getPasswordHashByEmailFromDb(email);
      const storedHash = passwordRow?.passwordHash;
      const hasValidHash =
        storedHash &&
        storedHash.trim().length > 0 &&
        storedHash.startsWith("scrypt:v1:");
      if (!hasValidHash || !passwordRow) {
        if (isDev) console.log("[login] User found but no valid password hash (id:", user.id, ")");
        const body: { error: string; reason?: string } = {
          error: "Parola nu a fost setată. Verifică emailul pentru invitație.",
        };
        if (isDev) body.reason = "no_password_hash";
        return NextResponse.json(body, { status: 401 });
      }
      const ok = await verifyPassword(password, storedHash);
      if (!ok) {
        if (isDev) console.log("[login] DB user found, password verify failed for:", user.email);
        const body: { error: string; reason?: string } = { error: "Invalid credentials" };
        if (isDev) body.reason = "password_verify_failed";
        return NextResponse.json(body, { status: 401 });
      }
      role = resolveRole(email, user.role);
      sub = user.id;
    }

    const token = await signJwt({ sub, role }, COOKIE_MAX_AGE_SEC);

    const res = NextResponse.json({ token, expiresIn: COOKIE_MAX_AGE_SEC });
    res.cookies.set(JWT_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE_SEC,
    });
    return res;
  } catch (e) {
    if (e instanceof Error && e.message.includes("JWT_SECRET")) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
