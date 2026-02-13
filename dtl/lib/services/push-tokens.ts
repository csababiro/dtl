import {
  getAdminTokensFromDb,
  addAdminTokenInDb,
  removeAdminTokenInDb,
  addUserTokenInDb,
  getUserTokenFromDb,
  removeUserTokenFromDb,
} from "@/lib/db/push-tokens";
import { withDbErrorHandling } from "./errors";

export async function getAdminTokens(): Promise<
  { data: string[] } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getAdminTokensFromDb());
}

export async function addAdminToken(
  token: string
): Promise<{ data: void } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => addAdminTokenInDb(token));
}

export async function removeAdminToken(
  token: string
): Promise<{ data: void } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => removeAdminTokenInDb(token));
}

export async function addUserToken(
  ref: string,
  token: string
): Promise<{ data: void } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => addUserTokenInDb(ref, token));
}

export async function getUserToken(
  ref: string
): Promise<
  { data: string | undefined } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getUserTokenFromDb(ref));
}

export async function removeUserToken(
  ref: string
): Promise<{ data: void } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => removeUserTokenFromDb(ref));
}
