import type { ClientPlata } from "@/lib/dummy-plati";
import { sql } from "./index";
import { getClientByEmailFromDb } from "./clients";

function rowToPlata(r: Record<string, unknown>): ClientPlata {
  return {
    id: String(r.id),
    clientId: String(r.client_id ?? ""),
    nrFactura: String(r.nr_factura ?? ""),
    data: String(r.data ?? ""),
    suma: String(r.suma ?? ""),
    descriere: String(r.descriere ?? ""),
    notes: r.notes != null ? String(r.notes) : undefined,
  };
}

export async function getPlatiFromDb(): Promise<ClientPlata[]> {
  const { rows } = await sql`SELECT * FROM plati ORDER BY data DESC`;
  return rows.map((r) => rowToPlata(r as Record<string, unknown>));
}

export async function getPlataByIdFromDb(id: string): Promise<ClientPlata | null> {
  const { rows } = await sql`SELECT * FROM plati WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return rowToPlata(rows[0] as Record<string, unknown>);
}

export async function getPlatiByClientIdFromDb(clientId: string): Promise<ClientPlata[]> {
  const { rows } = await sql`SELECT * FROM plati WHERE client_id = ${clientId} ORDER BY data DESC`;
  return rows.map((r) => rowToPlata(r as Record<string, unknown>));
}

export async function getPlatiByClientEmailFromDb(clientEmail: string): Promise<ClientPlata[]> {
  const client = await getClientByEmailFromDb(clientEmail);
  if (!client) return [];
  return getPlatiByClientIdFromDb(client.id);
}

export async function updatePlataNotesInDb(id: string, notes: string): Promise<ClientPlata | null> {
  const { rows } = await sql`UPDATE plati SET notes = ${notes} WHERE id = ${id} RETURNING *`;
  if (rows.length === 0) return null;
  return rowToPlata(rows[0] as Record<string, unknown>);
}
