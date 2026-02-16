import { NextResponse } from "next/server";
import { JWT_COOKIE, signJwt } from "@/lib/auth/jwt";

const COOKIE_MAX_AGE_SEC = 24 * 60 * 60; // 1 day

export async function POST(request: Request) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin login not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env" },
        { status: 503 }
      );
    }

    const body = (await request.json()) as { email?: string; password?: string };
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signJwt({ sub: email, role: "admin" }, COOKIE_MAX_AGE_SEC);

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
