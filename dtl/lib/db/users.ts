import type { DummyUser, DummyUserRole } from "@/lib/dummy-users";
import { sql } from "./index";
import pg from "pg";

/** Decode stored hash: may be hex-encoded (new) or plain scrypt:v1:... (legacy). */
function decodeStoredHash(raw: string | null | undefined): string | undefined {
  if (raw == null) return undefined;
  const s = String(raw).trim();
  if (s.length === 0) return undefined;
  if (s.includes(":")) return s;
  try {
    const decoded = Buffer.from(s, "hex").toString("utf8");
    return decoded.startsWith("scrypt:v1:") ? decoded : s;
  } catch {
    return s;
  }
}

function rowToUser(r: Record<string, unknown>): DummyUser {
  const rawHash = r.password_hash ?? (r as Record<string, unknown>).passwordHash;
  const passwordHash = decodeStoredHash(rawHash != null ? String(rawHash) : undefined);
  return {
    id: String(r.id),
    name: String(r.name ?? ""),
    email: String(r.email ?? ""),
    role: (r.role as DummyUserRole) ?? "Staff",
    active: Boolean(r.active),
    canManageUsers: r.can_manage_users != null ? Boolean(r.can_manage_users) : undefined,
    passwordHash,
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

export async function getUserByEmailFromDb(email: string): Promise<DummyUser | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  const { rows } = await sql`SELECT id, name, email, role, active, can_manage_users, password_hash, last_login FROM users WHERE email = ${normalized}`;
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

function getPgClient() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  return url ? new pg.Client({ connectionString: url }) : null;
}

/**
 * Read password hash with pg (same driver we write with). Use at login so verify gets the exact stored value.
 */
export async function getPasswordHashByEmailFromDb(
  email: string
): Promise<{ id: string; passwordHash: string | undefined } | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  const client = getPgClient();
  if (!client) return null;
  try {
    await client.connect();
    const res = await client.query(
      "SELECT id, password_hash FROM users WHERE email = $1",
      [normalized]
    );
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const raw = row?.password_hash ?? (row as Record<string, unknown>)?.password_hash;
    const passwordHash = decodeStoredHash(raw != null ? String(raw) : undefined);
    return { id: String(row.id), passwordHash: passwordHash ?? undefined };
  } finally {
    await client.end();
  }
}

/**
 * Use node-postgres (pg) for the password update so the hash is written correctly.
 * @vercel/postgres (Neon serverless) can mishandle long/special string params; pg does not.
 */
export async function setUserPasswordInDb(id: string, passwordHash: string): Promise<DummyUser | null> {
  const stored = Buffer.from(passwordHash, "utf8").toString("hex");
  const client = getPgClient();
  if (!client) return null;
  try {
    await client.connect();
    const res = await client.query(
      "UPDATE users SET password_hash = $1::text WHERE id = $2 RETURNING *",
      [stored, id]
    );
    if (res.rows.length === 0) return null;
    return rowToUser(res.rows[0] as Record<string, unknown>);
  } finally {
    await client.end();
  }
}
