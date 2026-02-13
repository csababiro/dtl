"use server";

import { revalidatePath } from "next/cache";
import { getAppointmentsByClientEmailFromDb, updateAppointmentNotesInDb } from "@/lib/db/appointments";
import { getPlatiByClientEmailFromDb, getPlataByIdFromDb, updatePlataNotesInDb } from "@/lib/db/plati";
import { getQuoteRequestsByEmailFromDb } from "@/lib/db/quote-requests";
import { getClientByEmailFromDb } from "@/lib/db/clients";

/** Get appointments for the logged-in client (by email). */
export async function getAppointmentsForClient(email: string) {
  if (!email?.trim()) return [];
  return getAppointmentsByClientEmailFromDb(email.trim());
}

/** Get plăți (facturi) for the logged-in client (by email). */
export async function getPlatiForClient(email: string) {
  if (!email?.trim()) return [];
  return getPlatiByClientEmailFromDb(email.trim());
}

/** Get cereri ofertă for the logged-in client (by email). */
export async function getCereriForClient(email: string) {
  if (!email?.trim()) return [];
  return getQuoteRequestsByEmailFromDb(email.trim());
}

/** Get a single plata by id; returns null if not found or not owned by client (by email). */
export async function getPlataForClient(plataId: string, clientEmail: string) {
  const client = await getClientByEmailFromDb(clientEmail?.trim() ?? "");
  if (!client) return null;
  const plata = await getPlataByIdFromDb(plataId);
  if (!plata || plata.clientId !== client.id) return null;
  return plata;
}

/** Update client notes for an appointment. Caller must ensure the appointment belongs to the client (e.g. by email). */
export async function updateAppointmentNotesForClient(
  appointmentId: string,
  clientNotes: string,
  clientEmail: string
) {
  const appointments = await getAppointmentsByClientEmailFromDb(clientEmail?.trim() ?? "");
  const owns = appointments.some((a) => a.id === appointmentId);
  if (!owns) return { ok: false };
  const updated = await updateAppointmentNotesInDb(appointmentId, { clientNotes });
  if (updated) revalidatePath("/cont");
  return { ok: !!updated };
}

/** Update notes for a plata (factură). Caller must ensure the plata belongs to the client. */
export async function updatePlataNotesForClient(
  plataId: string,
  notes: string,
  clientEmail: string
) {
  const client = await getClientByEmailFromDb(clientEmail?.trim() ?? "");
  if (!client) return { ok: false };
  const plata = await getPlataByIdFromDb(plataId);
  if (!plata || plata.clientId !== client.id) return { ok: false };
  const updated = await updatePlataNotesInDb(plataId, notes);
  if (updated) revalidatePath("/cont");
  return { ok: !!updated };
}
