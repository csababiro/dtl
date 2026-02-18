import * as jose from "jose";

export const JWT_COOKIE = "dtl_admin_jwt";
const DEFAULT_EXPIRY_SEC = 24 * 60 * 60; // 1 day

export type JwtPayload = { sub: string; role: string };

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set and at least 16 characters. See .env.example.");
  }
  return new TextEncoder().encode(secret);
}

export async function signJwt(payload: JwtPayload, expiresInSec = DEFAULT_EXPIRY_SEC): Promise<string> {
  const secret = getSecret();
  return await new jose.SignJWT({ ...payload, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${expiresInSec}s`)
    .sign(secret);
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const secret = getSecret();
    const { payload } = await jose.jwtVerify(token, secret);
    const sub = payload.sub ?? (payload as Record<string, unknown>).sub;
    const role = (payload as Record<string, unknown>).role;
    if (typeof sub !== "string" || typeof role !== "string") return null;
    return { sub, role };
  } catch {
    return null;
  }
}

/** Read JWT from Authorization Bearer header or from dtl_admin_jwt cookie. */
export async function getAuthFromRequest(request: Request): Promise<JwtPayload | null> {
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token) return verifyJwt(token);
  }
  const cookieHeader = request.headers.get("Cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(new RegExp(`${JWT_COOKIE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]+)`));
    const token = match?.[1]?.trim();
    if (token) return verifyJwt(decodeURIComponent(token));
  }
  return null;
}
