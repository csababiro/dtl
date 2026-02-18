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

/** Create or update a client by email so they appear in admin Clienți. Idempotent by email. */
export async function ensureClientInDb(data: {
  name: string;
  email: string;
  phone: string;
  car?: string;
}): Promise<DummyClient> {
  const existing = await getClientByEmailFromDb(data.email);
  if (existing) {
    await sql`
      UPDATE clients
      SET name = ${data.name.trim()}, phone = ${data.phone.trim()}, car = ${data.car?.trim() ?? null}
      WHERE id = ${existing.id}
    `;
    return {
      ...existing,
      name: data.name.trim(),
      phone: data.phone.trim(),
      car: data.car?.trim() || undefined,
    };
  }
  const id = "c-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  await sql`
    INSERT INTO clients (id, name, email, phone, car, programari_count)
    VALUES (${id}, ${data.name.trim()}, ${data.email.trim()}, ${data.phone.trim()}, ${data.car?.trim() ?? null}, 0)
  `;
  return {
    id,
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    car: data.car?.trim() || undefined,
    programariCount: 0,
  };
}

/** Backfill clients from appointments so existing programări show up in admin Clienți. Safe to run multiple times. */
export async function syncClientsFromAppointmentsInDb(): Promise<{ created: number }> {
  const { rows } = await sql`
    SELECT DISTINCT ON (LOWER(TRIM(email))) id, nume, telefon, email, marca, model
    FROM appointments
    ORDER BY LOWER(TRIM(email)), data DESC, ora DESC
  `;
  let created = 0;
  for (const r of rows as Array<Record<string, unknown>>) {
    const email = String(r.email ?? "").trim();
    if (!email) continue;
    const existing = await getClientByEmailFromDb(email);
    if (existing) continue;
    const name = String(r.nume ?? "").trim() || "—";
    const phone = String(r.telefon ?? "").trim() || "";
    const carParts = [String(r.marca ?? "").trim(), String(r.model ?? "").trim()].filter(Boolean);
    const car = carParts.length ? carParts.join(" ") : undefined;
    const id = "c-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    await sql`
      INSERT INTO clients (id, name, email, phone, car, programari_count)
      VALUES (${id}, ${name}, ${email}, ${phone}, ${car ?? null}, 0)
    `;
    created++;
  }
  return { created };
}
