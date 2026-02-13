import { sql } from "./index";

export async function getAdminTokensFromDb(): Promise<string[]> {
  const { rows } = await sql`SELECT token FROM push_tokens WHERE role = 'admin'`;
  return rows.map((r) => String((r as Record<string, unknown>).token));
}

export async function addAdminTokenInDb(token: string): Promise<void> {
  if (!token) return;
  const existing = await sql`SELECT id FROM push_tokens WHERE role = 'admin' AND token = ${token}`;
  if (existing.rows.length > 0) return;
  await sql`INSERT INTO push_tokens (role, ref, token) VALUES ('admin', null, ${token})`;
}

export async function removeAdminTokenInDb(token: string): Promise<void> {
  await sql`DELETE FROM push_tokens WHERE role = 'admin' AND token = ${token}`;
}

export async function addUserTokenInDb(ref: string, token: string): Promise<void> {
  if (!ref || !token) return;
  await sql`DELETE FROM push_tokens WHERE role = 'user' AND ref = ${ref}`;
  await sql`INSERT INTO push_tokens (role, ref, token) VALUES ('user', ${ref}, ${token})`;
}

export async function getUserTokenFromDb(ref: string): Promise<string | undefined> {
  const { rows } = await sql`SELECT token FROM push_tokens WHERE role = 'user' AND ref = ${ref} LIMIT 1`;
  if (rows.length === 0) return undefined;
  return String((rows[0] as Record<string, unknown>).token);
}

export async function removeUserTokenFromDb(ref: string): Promise<void> {
  await sql`DELETE FROM push_tokens WHERE role = 'user' AND ref = ${ref}`;
}
