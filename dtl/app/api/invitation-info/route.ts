import { NextResponse } from "next/server";
import { getInvitationByToken } from "@/lib/services/invitations";
import { getUserById } from "@/lib/services/users";

export const dynamic = "force-dynamic";

/** Public: validate invitation token and return email + userName for display. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")?.trim() ?? "";
  if (!token) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const invResult = await getInvitationByToken(token);
  if ("error" in invResult || !invResult.data) {
    return NextResponse.json({ ok: false, error: "expired" });
  }
  const inv = invResult.data;
  const userResult = await getUserById(inv.userId);
  if ("error" in userResult || !userResult.data) {
    return NextResponse.json({ ok: false, error: "invalid" });
  }
  return NextResponse.json({
    ok: true,
    email: inv.email,
    userName: userResult.data.name,
  });
}
