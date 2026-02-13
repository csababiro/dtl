"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { format, parse } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  updateAppointmentStatus,
  updateAppointmentDateTime,
  deleteAppointment,
  updateAppointmentNotes,
} from "@/lib/services";

export async function approveAppointment(prevOrFormData: unknown, formDataArg?: FormData) {
  const formData = formDataArg ?? (prevOrFormData instanceof FormData ? prevOrFormData : null);
  if (!formData) return { ok: false };
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false };
  const result = await updateAppointmentStatus(id, "Confirmat");
  if ("error" in result) return { ok: false };
  if (result.data) {
    revalidatePath("/admin/appointments");
    revalidatePath("/admin/calendar");
    revalidatePath(`/admin/appointments/${id}`);
    const returnToClientId = String(formData.get("returnToClientId") ?? "").trim();
    if (returnToClientId) revalidatePath(`/admin/clients/${returnToClientId}`);
  }
  return { ok: !!result.data };
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
  const result = await updateAppointmentDateTime(id, data, ora);
  if ("error" in result) return { ok: false };
  if (result.data) {
    revalidatePath("/admin/appointments");
    revalidatePath("/admin/calendar");
    revalidatePath(`/admin/appointments/${id}`);
    const returnToClientId = String(formData.get("returnToClientId") ?? "").trim();
    if (returnToClientId) revalidatePath(`/admin/clients/${returnToClientId}`);
  }
  return { ok: !!result.data };
}

export async function deleteAppointmentAction(prevOrFormData: unknown, formDataArg?: FormData) {
  const formData = formDataArg ?? (prevOrFormData instanceof FormData ? prevOrFormData : null);
  if (!formData) return { ok: false };
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false };
  const result = await deleteAppointment(id);
  if ("error" in result) return { ok: false };
  if (result.data) {
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
  const result = await updateAppointmentNotes(id, { descriere, clientNotes });
  if ("error" in result) return { ok: false };
  if (result.data) {
    revalidatePath("/admin/appointments");
    revalidatePath("/admin/calendar");
    revalidatePath(`/admin/appointments/${id}`);
    const returnToClientId = String(formData.get("returnToClientId") ?? "").trim();
    if (returnToClientId) revalidatePath(`/admin/clients/${returnToClientId}`);
  }
  return { ok: !!result.data };
}
