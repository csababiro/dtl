/**
 * Admin auth (stub until backend). Session in memory/localStorage.
 * Roles: super_admin | admin | technician
 */

export type AdminRole = "super_admin" | "admin" | "technician";

export interface AdminSession {
  role: AdminRole;
  email?: string;
}

const SESSION_KEY = "dtl_admin_session";

function getStored(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getSession(): AdminSession | null {
  return getStored();
}

export function setSession(session: AdminSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function isTechnician(session: AdminSession | null): boolean {
  return session?.role === "technician";
}

export function isSuperAdmin(session: AdminSession | null): boolean {
  return session?.role === "super_admin";
}
