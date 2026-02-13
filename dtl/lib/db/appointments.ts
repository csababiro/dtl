import type { DummyAppointment, DummyAppointmentStatus } from "@/lib/dummy-appointments";
import { sql } from "./index";

function rowToAppointment(r: Record<string, unknown>): DummyAppointment {
  return {
    id: String(r.id),
    nume: String(r.nume ?? ""),
    telefon: String(r.telefon ?? ""),
    email: String(r.email ?? ""),
    data: String(r.data ?? ""),
    ora: String(r.ora ?? ""),
    marca: String(r.marca ?? ""),
    model: String(r.model ?? ""),
    tip: (r.tip as DummyAppointment["tip"]) ?? "general",
    status: (r.status as DummyAppointmentStatus) ?? "În așteptare",
    descriere: r.descriere != null ? String(r.descriere) : undefined,
    clientNotes: r.client_notes != null ? String(r.client_notes) : undefined,
  };
}

export async function getAppointmentsFromDb(): Promise<DummyAppointment[]> {
  const { rows } = await sql`
    SELECT id, nume, telefon, email, data, ora, marca, model, tip, status, descriere, client_notes
    FROM appointments ORDER BY data DESC, ora DESC
  `;
  return rows.map((r) => rowToAppointment(r as Record<string, unknown>));
}

export async function getAppointmentByIdFromDb(id: string): Promise<DummyAppointment | null> {
  const { rows } = await sql`SELECT * FROM appointments WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return rowToAppointment(rows[0] as Record<string, unknown>);
}

export async function getAppointmentsByClientEmailFromDb(
  clientEmail: string
): Promise<DummyAppointment[]> {
  const email = clientEmail.trim().toLowerCase();
  const { rows } = await sql`
    SELECT * FROM appointments WHERE LOWER(TRIM(email)) = ${email}
    ORDER BY data DESC, ora DESC
  `;
  return rows.map((r) => rowToAppointment(r as Record<string, unknown>));
}

export async function createAppointmentInDb(data: {
  id: string;
  nume: string;
  telefon: string;
  email: string;
  data: string;
  ora: string;
  marca: string;
  model: string;
  tip: DummyAppointment["tip"];
  status: DummyAppointmentStatus;
  descriere?: string;
  clientNotes?: string;
}): Promise<DummyAppointment> {
  await sql`
    INSERT INTO appointments (id, nume, telefon, email, data, ora, marca, model, tip, status, descriere, client_notes)
    VALUES (
      ${data.id},
      ${data.nume},
      ${data.telefon},
      ${data.email},
      ${data.data},
      ${data.ora},
      ${data.marca},
      ${data.model},
      ${data.tip},
      ${data.status},
      ${data.descriere ?? null},
      ${data.clientNotes ?? null}
    )
  `;
  return {
    id: data.id,
    nume: data.nume,
    telefon: data.telefon,
    email: data.email,
    data: data.data,
    ora: data.ora,
    marca: data.marca,
    model: data.model,
    tip: data.tip,
    status: data.status,
    descriere: data.descriere,
    clientNotes: data.clientNotes,
  };
}

export async function updateAppointmentStatusInDb(
  id: string,
  status: DummyAppointmentStatus
): Promise<DummyAppointment | null> {
  const { rows } = await sql`UPDATE appointments SET status = ${status} WHERE id = ${id} RETURNING *`;
  if (rows.length === 0) return null;
  return rowToAppointment(rows[0] as Record<string, unknown>);
}

export async function updateAppointmentDateTimeInDb(
  id: string,
  data: string,
  ora: string
): Promise<DummyAppointment | null> {
  const { rows } =
    await sql`UPDATE appointments SET data = ${data}, ora = ${ora} WHERE id = ${id} RETURNING *`;
  if (rows.length === 0) return null;
  return rowToAppointment(rows[0] as Record<string, unknown>);
}

export async function deleteAppointmentFromDb(id: string): Promise<boolean> {
  const { rows } = await sql`DELETE FROM appointments WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function updateAppointmentNotesInDb(
  id: string,
  data: { descriere?: string; clientNotes?: string }
): Promise<DummyAppointment | null> {
  if (data.descriere !== undefined) {
    await sql`UPDATE appointments SET descriere = ${data.descriere} WHERE id = ${id}`;
  }
  if (data.clientNotes !== undefined) {
    await sql`UPDATE appointments SET client_notes = ${data.clientNotes} WHERE id = ${id}`;
  }
  return getAppointmentByIdFromDb(id);
}