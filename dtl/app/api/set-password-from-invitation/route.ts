import { NextResponse } from "next/server";
import {
  getInvitationByToken,
  invalidateInvitation,
} from "@/lib/services/invitations";
import { setUserPassword } from "@/lib/services/users";
import { hashPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

/** Public: set password from invitation token, then invalidate token. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: string;
      password?: string;
      confirmPassword?: string;
    };
    const token = String(body.token ?? "").trim();
    const password = String(body.password ?? "");
    const confirm = String(body.confirmPassword ?? "");

    if (!token) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { ok: false, error: "password_too_short" },
        { status: 400 }
      );
    }
    if (password !== confirm) {
      return NextResponse.json(
        { ok: false, error: "password_mismatch" },
        { status: 400 }
      );
    }

    const invResult = await getInvitationByToken(token);
    if ("error" in invResult || !invResult.data) {
      return NextResponse.json({ ok: false, error: "expired" });
    }
    const inv = invResult.data;

    const hashed = await hashPassword(password);
    const setResult = await setUserPassword(inv.userId, hashed);
    if ("error" in setResult || !setResult.data) {
      return NextResponse.json({ ok: false, error: "invalid" });
    }

    const invalResult = await invalidateInvitation(token);
    if ("error" in invalResult) {
      return NextResponse.json({ ok: false, error: "invalid" });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
}
