"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { format, parse } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  updateAppointmentStatusInDb,
  updateAppointmentDateTimeInDb,
  deleteAppointmentFromDb,
  updateAppointmentNotesInDb,
} from "@/lib/db/appointments";

export async function approveAppointment(prevOrFormData: unknown, formDataArg?: FormData) {
  const formData = formDataArg ?? (prevOrFormData instanceof FormData ? prevOrFormData : null);
  if (!formData) return { ok: false };
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false };
  const updated = await updateAppointmentStatusInDb(id, "Confirmat");
  if (updated) {
    revalidatePath("/admin/appointments");
    revalidatePath("/admin/calendar");
    revalidatePath(`/admin/appointments/${id}`);
    const returnToClientId = String(formData.get("returnToClientId") ?? "").trim();
    if (returnToClientId) revalidatePath(`/admin/clients/${returnToClientId}`);
  }
  return { ok: !!updated };
}

/** Update appointment date and time. formData: id, data (YYYY-MM-DD), ora (HH:mm). */
export async function updateAppointmentTime(
  prevOrFormData: unknown,
  formDataArg?: FormData
) {
  const formData = formDataArg ?? (prevOrFormData instanceof FormData ? prevOrFormData : null);
  if (!formData) return { ok: false };
  const id = String(formData.get("id") ?? "").trim();
  const dataInput = String(formData.get("data") ?? "").trim();
  const ora = String(formData.get("ora") ?? "").trim();
  if (!id || !dataInput || !ora) return { ok: false };
  const parsed = parse(dataInput, "yyyy-MM-dd", new Date());
  const data = format(parsed, "d MMM yyyy", { locale: enUS });
  const updated = await updateAppointmentDateTimeInDb(id, data, ora);
  if (updated) {
    revalidatePath("/admin/appointments");
    revalidatePath("/admin/calendar");
    revalidatePath(`/admin/appointments/${id}`);
    const returnToClientId = String(formData.get("returnToClientId") ?? "").trim();
    if (returnToClientId) revalidatePath(`/admin/clients/${returnToClientId}`);
  }
  return { ok: !!updated };
}

export async function deleteAppointmentAction(prevOrFormData: unknown, formDataArg?: FormData) {
  const formData = formDataArg ?? (prevOrFormData instanceof FormData ? prevOrFormData : null);
  if (!formData) return { ok: false };
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false };
  const deleted = await deleteAppointmentFromDb(id);
  if (deleted) {
    revalidatePath("/admin/appointments");
    revalidatePath("/admin/calendar");
    const returnToClientId = String(formData.get("returnToClientId") ?? "").trim();
    if (returnToClientId) {
      revalidatePath(`/admin/clients/${returnToClientId}`);
      redirect(`/admin/clients/${returnToClientId}`);
    }
    redirect("/admin/appointments");
  }
  return { ok: false };
}

/** Update descriere and/or clientNotes for an appointment. */
export async function updateAppointmentNotesAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false };
  const descriere = formData.get("descriere") != null ? String(formData.get("descriere")).trim() : undefined;
  const clientNotes = formData.get("clientNotes") != null ? String(formData.get("clientNotes")).trim() : undefined;
  const updated = await updateAppointmentNotesInDb(id, { descriere, clientNotes });
  if (updated) {
    revalidatePath("/admin/appointments");
    revalidatePath("/admin/calendar");
    revalidatePath(`/admin/appointments/${id}`);
    const returnToClientId = String(formData.get("returnToClientId") ?? "").trim();
    if (returnToClientId) revalidatePath(`/admin/clients/${returnToClientId}`);
  }
  return { ok: !!updated };
}
