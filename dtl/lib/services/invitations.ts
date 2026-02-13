import type { Invitation } from "@/lib/invitation-store";
import {
  createInvitationInDb,
  getInvitationByTokenFromDb,
  invalidateInvitationInDb,
} from "@/lib/db/invitations";
import { withDbErrorHandling } from "./errors";

export async function createInvitation(
  userId: string,
  email: string
): Promise<{ data: Invitation } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => createInvitationInDb(userId, email));
}

export async function getInvitationByToken(
  token: string
): Promise<
  { data: Invitation | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getInvitationByTokenFromDb(token));
}

export async function invalidateInvitation(
  token: string
): Promise<{ data: void } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => invalidateInvitationInDb(token));
}
