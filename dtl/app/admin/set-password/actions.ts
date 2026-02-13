"use server";

import { redirect } from "next/navigation";
import {
  getInvitationByToken,
  invalidateInvitation,
  getUserById,
  setUserPassword,
} from "@/lib/services";
import { hashPassword } from "@/lib/password";

/** Return invitation details for display (email, userName). Fails if token invalid or expired. */
export async function getInvitationInfo(token: string | null) {
  if (!token?.trim()) return { ok: false as const, error: "invalid" };
  const invResult = await getInvitationByToken(token.trim());
  if ("error" in invResult || !invResult.data) return { ok: false as const, error: "expired" };
  const inv = invResult.data;
  const userResult = await getUserById(inv.userId);
  if ("error" in userResult || !userResult.data) return { ok: false as const, error: "invalid" };
  return {
    ok: true as const,
    email: inv.email,
    userName: userResult.data.name,
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

  const invResult = await getInvitationByToken(token);
  if ("error" in invResult || !invResult.data) return { ok: false, error: "expired" as const };
  const inv = invResult.data;

  const hashed = await hashPassword(password);
  const setResult = await setUserPassword(inv.userId, hashed);
  if ("error" in setResult || !setResult.data) return { ok: false, error: "invalid" as const };

  const invalResult = await invalidateInvitation(token);
  if ("error" in invalResult) return { ok: false, error: "invalid" as const };
  redirect("/admin/login?set=1");
}
