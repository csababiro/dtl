/**
 * Mutable in-memory store for admin users (Utilizatori).
 * Seeded from dummy data; used by admin users page and server actions.
 */

import type { DummyUser, DummyUserRole } from "@/lib/dummy-users";
import { DUMMY_USERS } from "@/lib/dummy-users";

const store: DummyUser[] =
  typeof globalThis !== "undefined" &&
  (globalThis as unknown as { __users?: DummyUser[] }).__users
    ? (globalThis as unknown as { __users: DummyUser[] }).__users
    : ((globalThis as unknown as { __users: DummyUser[] }).__users =
        DUMMY_USERS.map((u) => ({ ...u })));

export type { DummyUser, DummyUserRole };

export function getUsers(): DummyUser[] {
  return store.map((u) => ({ ...u }));
}

export function getUserById(id: string): DummyUser | null {
  const u = store.find((x) => x.id === id);
  return u ? { ...u } : null;
}

/** Id of the current user in mock mode (env NEXT_PUBLIC_MOCK_USER_ID). Super admin id if unset. */
function getCurrentUserId(): string | undefined {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_MOCK_USER_ID) {
    return process.env.NEXT_PUBLIC_MOCK_USER_ID;
  }
  const superAdmin = store.find((u) => u.role === "Super Admin");
  return superAdmin?.id;
}

/** True if the current user can create/edit/delete users and set active/canManageUsers. */
export function getCurrentUserCanManageUsers(): boolean {
  const id = getCurrentUserId();
  if (!id) return false;
  const u = store.find((x) => x.id === id);
  if (!u) return false;
  if (u.role === "Super Admin") return true;
  if (u.role === "Admin" && u.canManageUsers === true) return true;
  return false;
}

export function addUser(data: {
  name: string;
  email: string;
  role: DummyUserRole;
  active: boolean;
  canManageUsers?: boolean;
}): DummyUser {
  const id = "u" + String(Date.now());
  const user: DummyUser = {
    id,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    role: data.role,
    active: data.active,
    canManageUsers: data.role === "Admin" ? !!data.canManageUsers : undefined,
  };
  store.push(user);
  return { ...user };
}

export function updateUser(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    role: DummyUserRole;
    active: boolean;
    canManageUsers: boolean;
  }>
): DummyUser | null {
  const u = store.find((x) => x.id === id);
  if (!u) return null;
  if (data.name !== undefined) u.name = data.name.trim();
  if (data.email !== undefined) u.email = data.email.trim().toLowerCase();
  if (data.role !== undefined) {
    u.role = data.role;
    u.canManageUsers =
      data.role === "Admin" ? (data.canManageUsers ?? u.canManageUsers) : undefined;
  }
  if (data.active !== undefined) u.active = data.active;
  if (data.canManageUsers !== undefined && u.role === "Admin")
    u.canManageUsers = data.canManageUsers;
  return { ...u };
}

export function deleteUser(id: string): boolean {
  const idx = store.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}

export function setUserActive(id: string, active: boolean): DummyUser | null {
  return updateUser(id, { active });
}

/** Set password hash for user (after invitation set-password). */
export function setUserPassword(id: string, passwordHash: string): DummyUser | null {
  const u = store.find((x) => x.id === id);
  if (!u) return null;
  u.passwordHash = passwordHash;
  return { ...u };
}
