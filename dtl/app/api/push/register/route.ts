import { NextResponse } from "next/server";
import { addAdminTokenInDb, addUserTokenInDb } from "@/lib/db/push-tokens";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: string;
      role?: string;
      ref?: string;
    };
    const { token, role, ref } = body;
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "token required" }, { status: 400 });
    }
    if (role === "admin") {
      await addAdminTokenInDb(token);
      return NextResponse.json({ ok: true });
    }
    if (role === "user" && ref && typeof ref === "string") {
      await addUserTokenInDb(ref, token);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: "role and ref (for user) required" },
      { status: 400 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Bad request" },
      { status: 400 }
    );
  }
}
