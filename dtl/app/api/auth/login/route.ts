import { NextResponse } from "next/server";
import { JWT_COOKIE, signJwt } from "@/lib/auth/jwt";
import { getUserByEmailFromDb } from "@/lib/db/users";
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
    const adminPassword = process.env.ADMIN_PASSWORD;

    const body = (await request.json()) as { email?: string; password?: string };
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    let role: JwtRole;
    let sub: string;

    if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
      role = "super_admin";
      sub = email;
    } else {
      const user = await getUserByEmailFromDb(email);
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      if (!user.active) {
        return NextResponse.json({ error: "Cont dezactivat" }, { status: 401 });
      }
      if (!user.passwordHash) {
        return NextResponse.json(
          { error: "Parola nu a fost setată. Verifică emailul pentru invitație." },
          { status: 401 }
        );
      }
      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
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
