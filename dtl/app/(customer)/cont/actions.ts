"use server";

import { revalidatePath } from "next/cache";
import { getAppointmentsByClientEmail } from "@/lib/appointments-store";
import { getPlatiByClientEmail, getPlataById, updatePlataNotes as updatePlataNotesStore } from "@/lib/plati-store";
import { getQuoteRequestsByEmail } from "@/lib/quote-requests-store";
import { updateAppointmentNotes } from "@/lib/appointments-store";
import { getClientByEmail } from "@/lib/dummy-clients";

/** Get appointments for the logged-in client (by email). */
export async function getAppointmentsForClient(email: string) {
  if (!email?.trim()) return [];
  return getAppointmentsByClientEmail(email.trim());
}

/** Get plăți (facturi) for the logged-in client (by email). */
export async function getPlatiForClient(email: string) {
  if (!email?.trim()) return [];
  return getPlatiByClientEmail(email.trim());
}

/** Get cereri ofertă for the logged-in client (by email). */
export async function getCereriForClient(email: string) {
  if (!email?.trim()) return [];
  return getQuoteRequestsByEmail(email.trim());
}

/** Get a single plata by id; returns null if not found or not owned by client (by email). */
export async function getPlataForClient(plataId: string, clientEmail: string) {
  const client = getClientByEmail(clientEmail?.trim() ?? "");
  if (!client) return null;
  const plata = getPlataById(plataId);
  if (!plata || plata.clientId !== client.id) return null;
  return plata;
}

/** Update client notes for an appointment. Caller must ensure the appointment belongs to the client (e.g. by email). */
export async function updateAppointmentNotesForClient(
  appointmentId: string,
  clientNotes: string,
  clientEmail: string
) {
  const appointments = getAppointmentsByClientEmail(clientEmail?.trim() ?? "");
  const owns = appointments.some((a) => a.id === appointmentId);
  if (!owns) return { ok: false };
  const updated = updateAppointmentNotes(appointmentId, { clientNotes });
  if (updated) revalidatePath("/cont");
  return { ok: !!updated };
}

/** Update notes for a plata (factură). Caller must ensure the plata belongs to the client. */
export async function updatePlataNotesForClient(
  plataId: string,
  notes: string,
  clientEmail: string
) {
  const client = getClientByEmail(clientEmail?.trim() ?? "");
  if (!client) return { ok: false };
  const plata = getPlataById(plataId);
  if (!plata || plata.clientId !== client.id) return { ok: false };
  const updated = updatePlataNotesStore(plataId, notes);
  if (updated) revalidatePath("/cont");
  return { ok: !!updated };
}
