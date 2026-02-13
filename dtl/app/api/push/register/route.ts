import { NextResponse } from "next/server";
import { addAdminToken, addUserToken } from "@/lib/services";

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
      const result = await addAdminToken(token);
      if ("error" in result)
        return NextResponse.json({ error: result.error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    if (role === "user" && ref && typeof ref === "string") {
      const result = await addUserToken(ref, token);
      if ("error" in result)
        return NextResponse.json({ error: result.error.message }, { status: 500 });
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
