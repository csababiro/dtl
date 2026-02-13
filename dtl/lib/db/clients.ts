import type { DummyClient } from "@/lib/dummy-clients";
import { sql } from "./index";

function rowToClient(r: Record<string, unknown>): DummyClient {
  return {
    id: String(r.id),
    name: String(r.name ?? ""),
    email: String(r.email ?? ""),
    phone: String(r.phone ?? ""),
    car: r.car != null ? String(r.car) : undefined,
    programariCount: Number(r.programari_count ?? 0),
    lastVisit: r.last_visit != null ? String(r.last_visit) : undefined,
  };
}

export async function getClientsFromDb(): Promise<DummyClient[]> {
  const { rows } = await sql`SELECT * FROM clients ORDER BY name`;
  return rows.map((r) => rowToClient(r as Record<string, unknown>));
}

export async function getClientByIdFromDb(id: string): Promise<DummyClient | null> {
  const { rows } = await sql`SELECT * FROM clients WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return rowToClient(rows[0] as Record<string, unknown>);
}

export async function getClientByEmailFromDb(email: string): Promise<DummyClient | null> {
  const normalized = email.trim().toLowerCase();
  const { rows } = await sql`SELECT * FROM clients WHERE LOWER(TRIM(email)) = ${normalized}`;
  if (rows.length === 0) return null;
  return rowToClient(rows[0] as Record<string, unknown>);
}
