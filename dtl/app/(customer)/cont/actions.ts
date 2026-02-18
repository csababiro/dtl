"use server";

import { revalidatePath } from "next/cache";
import {
  getAppointmentsByClientEmail,
  updateAppointmentNotes,
  getPlatiByClientEmail,
  getPlataById,
  updatePlataNotes,
  getQuoteRequestsByEmail,
  getClientByEmail,
  ensureClient,
} from "@/lib/services";

/** Register a new client (sign-up on Cont). Creates or updates the client so they appear in admin Clienți. */
export async function registerClient(name: string, email: string, phone: string) {
  if (!name?.trim() || !email?.trim()) return { ok: false as const, error: "validation" as const };
  const result = await ensureClient({
    name: name.trim(),
    email: email.trim(),
    phone: (phone ?? "").trim(),
  });
  if ("error" in result) return { ok: false as const, error: "server" as const };
  return { ok: true as const };
}

/** Get appointments for the logged-in client (by email). */
export async function getAppointmentsForClient(email: string) {
  if (!email?.trim()) return [];
  const result = await getAppointmentsByClientEmail(email.trim());
  return "error" in result ? [] : result.data;
}

/** Get plăți (facturi) for the logged-in client (by email). */
export async function getPlatiForClient(email: string) {
  if (!email?.trim()) return [];
  const result = await getPlatiByClientEmail(email.trim());
  return "error" in result ? [] : result.data;
}

/** Get cereri ofertă for the logged-in client (by email). */
export async function getCereriForClient(email: string) {
  if (!email?.trim()) return [];
  const result = await getQuoteRequestsByEmail(email.trim());
  return "error" in result ? [] : result.data;
}

/** Get a single plata by id; returns null if not found or not owned by client (by email). */
export async function getPlataForClient(plataId: string, clientEmail: string) {
  const clientResult = await getClientByEmail(clientEmail?.trim() ?? "");
  if ("error" in clientResult || !clientResult.data) return null;
  const plataResult = await getPlataById(plataId);
  if ("error" in plataResult || !plataResult.data) return null;
  if (plataResult.data.clientId !== clientResult.data.id) return null;
  return plataResult.data;
}

/** Update client notes for an appointment. Caller must ensure the appointment belongs to the client (e.g. by email). */
export async function updateAppointmentNotesForClient(
  appointmentId: string,
  clientNotes: string,
  clientEmail: string
) {
  const appResult = await getAppointmentsByClientEmail(clientEmail?.trim() ?? "");
  if ("error" in appResult) return { ok: false };
  const owns = appResult.data.some((a) => a.id === appointmentId);
  if (!owns) return { ok: false };
  const result = await updateAppointmentNotes(appointmentId, { clientNotes });
  if ("error" in result) return { ok: false };
  if (result.data) revalidatePath("/cont");
  return { ok: !!result.data };
}

/** Update notes for a plata (factură). Caller must ensure the plata belongs to the client. */
export async function updatePlataNotesForClient(
  plataId: string,
  notes: string,
  clientEmail: string
) {
  const clientResult = await getClientByEmail(clientEmail?.trim() ?? "");
  if ("error" in clientResult || !clientResult.data) return { ok: false };
  const plataResult = await getPlataById(plataId);
  if ("error" in plataResult || !plataResult.data) return { ok: false };
  if (plataResult.data.clientId !== clientResult.data.id) return { ok: false };
  const result = await updatePlataNotes(plataId, notes);
  if ("error" in result) return { ok: false };
  if (result.data) revalidatePath("/cont");
  return { ok: !!result.data };
}
