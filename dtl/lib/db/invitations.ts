import { randomBytes } from "crypto";
import type { Invitation } from "@/lib/invitation-store";
import { sql } from "./index";

const INVITATION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

function rowToInvitation(r: Record<string, unknown>): Invitation {
  return {
    token: String(r.token),
    userId: String(r.user_id ?? ""),
    email: String(r.email ?? ""),
    expiresAt: Number(r.expires_at),
  };
}

function randomToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createInvitationInDb(userId: string, email: string): Promise<Invitation> {
  await sql`DELETE FROM invitations WHERE user_id = ${userId}`;
  const token = randomToken();
  const expiresAt = Date.now() + INVITATION_EXPIRY_MS;
  await sql`
    INSERT INTO invitations (token, user_id, email, expires_at)
    VALUES (${token}, ${userId}, ${email}, ${expiresAt})
  `;
  return { token, userId, email, expiresAt };
}

export async function getInvitationByTokenFromDb(token: string): Promise<Invitation | null> {
  const { rows } = await sql`SELECT * FROM invitations WHERE token = ${token}`;
  if (rows.length === 0) return null;
  const inv = rowToInvitation(rows[0] as Record<string, unknown>);
  if (inv.expiresAt < Date.now()) return null;
  return inv;
}

export async function invalidateInvitationInDb(token: string): Promise<void> {
  await sql`DELETE FROM invitations WHERE token = ${token}`;
}
