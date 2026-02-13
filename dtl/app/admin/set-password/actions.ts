"use server";

import { redirect } from "next/navigation";
import { getInvitationByTokenFromDb, invalidateInvitationInDb } from "@/lib/db/invitations";
import { getUserByIdFromDb, setUserPasswordInDb } from "@/lib/db/users";
import { hashPassword } from "@/lib/password";

/** Return invitation details for display (email, userName). Fails if token invalid or expired. */
export async function getInvitationInfo(token: string | null) {
  if (!token?.trim()) return { ok: false as const, error: "invalid" };
  const inv = await getInvitationByTokenFromDb(token.trim());
  if (!inv) return { ok: false as const, error: "expired" };
  const user = await getUserByIdFromDb(inv.userId);
  if (!user) return { ok: false as const, error: "invalid" };
  return {
    ok: true as const,
    email: inv.email,
    userName: user.name,
  };
}

/** Set password from invitation token; then invalidate token and redirect to login. */
export async function setPasswordFromInvitationAction(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!token) return { ok: false, error: "invalid" as const };
  if (password.length < 8) return { ok: false, error: "password_too_short" as const };
  if (password !== confirm) return { ok: false, error: "password_mismatch" as const };

  const inv = await getInvitationByTokenFromDb(token);
  if (!inv) return { ok: false, error: "expired" as const };

  const hashed = await hashPassword(password);
  const updated = await setUserPasswordInDb(inv.userId, hashed);
  if (!updated) return { ok: false, error: "invalid" as const };

  await invalidateInvitationInDb(token);
  redirect("/admin/login?set=1");
}
