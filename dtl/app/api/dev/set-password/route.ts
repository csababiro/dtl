import { NextResponse } from "next/server";
import { getUserByEmailFromDb } from "@/lib/db/users";
import { hashPassword } from "@/lib/password";
import { setUserPassword } from "@/lib/services";

/**
 * Dev-only: set password for a user by email using the app's DB and hasher.
 * Same connection and code path as login – use this when the script doesn't fix login.
 *
 * POST /api/dev/set-password
 * Body: { "email": "admin@dtl.ro", "password": "qwertyui" }
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "").trim();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Body: { email, password } required" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }
    const user = await getUserByEmailFromDb(email);
    if (!user) {
      return NextResponse.json(
        { error: "User not found for email: " + email },
        { status: 404 }
      );
    }
    const hashed = await hashPassword(password);
    const result = await setUserPassword(user.id, hashed);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({
      ok: true,
      message: "Password set for " + user.email,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
