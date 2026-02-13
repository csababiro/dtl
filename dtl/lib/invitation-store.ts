/**
 * In-memory store for admin/staff invitation tokens (set-password links).
 * Token is valid for 7 days; one active invitation per user (new one replaces old).
 * Server-only (used by actions and set-password route).
 */

import { randomBytes } from "crypto";

const INVITATION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export interface Invitation {
  token: string;
  userId: string;
  email: string;
  expiresAt: number;
}

const store: Invitation[] =
  typeof globalThis !== "undefined" &&
  (globalThis as unknown as { __invitations?: Invitation[] }).__invitations
    ? (globalThis as unknown as { __invitations: Invitation[] }).__invitations
    : ((globalThis as unknown as { __invitations: Invitation[] }).__invitations = []);

function randomToken(): string {
  return randomBytes(32).toString("hex");
}

/** Create invitation for user; returns token and expiry. Replaces any existing invitation for this userId. */
export function createInvitation(userId: string, email: string): Invitation {
  const existing = store.findIndex((i) => i.userId === userId);
  if (existing >= 0) store.splice(existing, 1);
  const token = randomToken();
  const expiresAt = Date.now() + INVITATION_EXPIRY_MS;
  const inv: Invitation = { token, userId, email, expiresAt };
  store.push(inv);
  return inv;
}

/** Get invitation by token if valid and not expired. */
export function getInvitationByToken(token: string): Invitation | null {
  const inv = store.find((i) => i.token === token);
  if (!inv || inv.expiresAt < Date.now()) return null;
  return inv;
}

/** Invalidate token (after password set or cancel). */
export function invalidateInvitation(token: string): void {
  const idx = store.findIndex((i) => i.token === token);
  if (idx >= 0) store.splice(idx, 1);
}
