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

function redirectToLogin(request: Request, error: string) {
  const base = new URL(request.url).origin;
  return NextResponse.redirect(`${base}/admin/login?error=${encodeURIComponent(error)}`);
}

function redirectToAdmin(request: Request) {
  return NextResponse.redirect(new URL("/admin", request.url));
}

export async function POST(request: Request) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();

    let email: string;
    let password: string;
    const ct = request.headers.get("content-type") ?? "";
    if (ct.includes("application/x-www-form-urlencoded")) {
      const form = await request.formData();
      email = String(form.get("email") ?? "").trim().toLowerCase();
      password = String(form.get("password") ?? "").trim();
    } else {
      const body = (await request.json()) as { email?: string; password?: string };
      email = String(body.email ?? "").trim().toLowerCase();
      password = String(body.password ?? "").trim();
    }

    if (!email) {
      return redirectToLogin(request, "Email required");
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
        return redirectToLogin(request, "Invalid credentials");
      }
      if (!user.active) {
        return redirectToLogin(request, "Cont dezactivat");
      }
      const passwordRow = await getPasswordHashByEmailFromDb(email);
      const storedHash = passwordRow?.passwordHash;
      const hasValidHash =
        storedHash &&
        storedHash.trim().length > 0 &&
        storedHash.startsWith("scrypt:v1:");
      if (!hasValidHash || !passwordRow) {
        if (isDev) console.log("[login] User found but no valid password hash (id:", user.id, ")");
        return redirectToLogin(request, "Parola nu a fost setată. Verifică emailul pentru invitație.");
      }
      const ok = await verifyPassword(password, storedHash);
      if (!ok) {
        if (isDev) console.log("[login] DB user found, password verify failed for:", user.email);
        return redirectToLogin(request, "Invalid credentials");
      }
      role = resolveRole(email, user.role);
      sub = user.id;
    }

    const token = await signJwt({ sub, role }, COOKIE_MAX_AGE_SEC);

    const res = redirectToAdmin(request);
    res.cookies.set(JWT_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE_SEC,
    });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e) {
    if (e instanceof Error && e.message.includes("JWT_SECRET")) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
