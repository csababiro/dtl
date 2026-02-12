/**
 * In-memory store for FCM tokens (admin and user by ref).
 * No API/DB yet; resets on cold start (e.g. Vercel serverless).
 */

const adminTokens: string[] =
  typeof globalThis !== "undefined" && (globalThis as unknown as { __pushAdminTokens?: string[] }).__pushAdminTokens
    ? (globalThis as unknown as { __pushAdminTokens: string[] }).__pushAdminTokens
    : ((globalThis as unknown as { __pushAdminTokens: string[] }).__pushAdminTokens = []);

const userTokensByRef: Map<string, string> =
  typeof globalThis !== "undefined" && (globalThis as unknown as { __pushUserTokens?: Map<string, string> }).__pushUserTokens
    ? (globalThis as unknown as { __pushUserTokens: Map<string, string> }).__pushUserTokens
    : ((globalThis as unknown as { __pushUserTokens: Map<string, string> }).__pushUserTokens = new Map());

export function getAdminTokens(): string[] {
  return [...adminTokens];
}

export function addAdminToken(token: string): void {
  if (!token || adminTokens.includes(token)) return;
  adminTokens.push(token);
}

export function removeAdminToken(token: string): void {
  const i = adminTokens.indexOf(token);
  if (i >= 0) adminTokens.splice(i, 1);
}

export function addUserToken(ref: string, token: string): void {
  if (!ref || !token) return;
  userTokensByRef.set(ref, token);
}

export function getUserToken(ref: string): string | undefined {
  return userTokensByRef.get(ref);
}

export function removeUserToken(ref: string): void {
  userTokensByRef.delete(ref);
}
