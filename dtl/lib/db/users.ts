import type { DummyUser, DummyUserRole } from "@/lib/dummy-users";
import { sql } from "./index";

function rowToUser(r: Record<string, unknown>): DummyUser {
  return {
    id: String(r.id),
    name: String(r.name ?? ""),
    email: String(r.email ?? ""),
    role: (r.role as DummyUserRole) ?? "Staff",
    active: Boolean(r.active),
    canManageUsers: r.can_manage_users != null ? Boolean(r.can_manage_users) : undefined,
    passwordHash: r.password_hash != null ? String(r.password_hash) : undefined,
    lastLogin: r.last_login != null ? String(r.last_login) : undefined,
  };
}

export async function getUsersFromDb(): Promise<DummyUser[]> {
  const { rows } = await sql`SELECT * FROM users ORDER BY name`;
  return rows.map((r) => rowToUser(r as Record<string, unknown>));
}

export async function getUserByIdFromDb(id: string): Promise<DummyUser | null> {
  const { rows } = await sql`SELECT * FROM users WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return rowToUser(rows[0] as Record<string, unknown>);
}

export async function getCurrentUserCanManageUsersFromDb(): Promise<boolean> {
  const mockId = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_MOCK_USER_ID : undefined;
  if (mockId) {
    const u = await getUserByIdFromDb(mockId);
    if (!u) return false;
    if (u.role === "Super Admin") return true;
    if (u.role === "Admin" && u.canManageUsers === true) return true;
    return false;
  }
  const users = await getUsersFromDb();
  const superAdmin = users.find((u) => u.role === "Super Admin");
  return Boolean(superAdmin);
}

function nextUserId(): string {
  return "u" + String(Date.now());
}

export async function addUserInDb(data: {
  name: string;
  email: string;
  role: DummyUserRole;
  active: boolean;
  canManageUsers?: boolean;
}): Promise<DummyUser> {
  const id = nextUserId();
  const canManage = data.role === "Admin" ? !!data.canManageUsers : null;
  await sql`
    INSERT INTO users (id, name, email, role, active, can_manage_users)
    VALUES (${id}, ${data.name.trim()}, ${data.email.trim().toLowerCase()}, ${data.role}, ${data.active}, ${canManage})
  `;
  const u = await getUserByIdFromDb(id);
  return u!;
}

export async function updateUserInDb(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    role: DummyUserRole;
    active: boolean;
    canManageUsers: boolean;
  }>
): Promise<DummyUser | null> {
  const u = await getUserByIdFromDb(id);
  if (!u) return null;
  const name = data.name !== undefined ? data.name.trim() : u.name;
  const email = data.email !== undefined ? data.email.trim().toLowerCase() : u.email;
  const role = data.role ?? u.role;
  const active = data.active ?? u.active;
  const canManage =
    data.canManageUsers !== undefined && role === "Admin" ? data.canManageUsers : u.canManageUsers;
  await sql`
    UPDATE users SET name = ${name}, email = ${email}, role = ${role}, active = ${active}, can_manage_users = ${role === "Admin" ? canManage : null}
    WHERE id = ${id}
  `;
  return getUserByIdFromDb(id);
}

export async function deleteUserFromDb(id: string): Promise<boolean> {
  const { rows } = await sql`DELETE FROM users WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function setUserPasswordInDb(id: string, passwordHash: string): Promise<DummyUser | null> {
  const { rows } = await sql`UPDATE users SET password_hash = ${passwordHash} WHERE id = ${id} RETURNING *`;
  if (rows.length === 0) return null;
  return rowToUser(rows[0] as Record<string, unknown>);
}
