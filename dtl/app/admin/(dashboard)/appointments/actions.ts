"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { format, parse } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  updateAppointmentStatus,
  updateAppointmentDateTime,
  deleteAppointment as deleteAppointmentStore,
} from "@/lib/appointments-store";

export async function approveAppointment(_prev: unknown, formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false };
  const updated = updateAppointmentStatus(id, "Confirmat");
  if (updated) {
    revalidatePath("/admin/appointments");
    revalidatePath("/admin/calendar");
    revalidatePath(`/admin/appointments/${id}`);
  }
  return { ok: !!updated };
}

/** Update appointment date and time. formData: id, data (YYYY-MM-DD), ora (HH:mm). */
export async function updateAppointmentTime(
  _prev: unknown,
  formData: FormData
) {
  const id = String(formData.get("id") ?? "").trim();
  const dataInput = String(formData.get("data") ?? "").trim();
  const ora = String(formData.get("ora") ?? "").trim();
  if (!id || !dataInput || !ora) return { ok: false };
  const parsed = parse(dataInput, "yyyy-MM-dd", new Date());
  const data = format(parsed, "d MMM yyyy", { locale: enUS });
  const updated = updateAppointmentDateTime(id, data, ora);
  if (updated) {
    revalidatePath("/admin/appointments");
    revalidatePath("/admin/calendar");
    revalidatePath(`/admin/appointments/${id}`);
  }
  return { ok: !!updated };
}

export async function deleteAppointmentAction(_prev: unknown, formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false };
  const deleted = deleteAppointmentStore(id);
  if (deleted) {
    revalidatePath("/admin/appointments");
    revalidatePath("/admin/calendar");
    redirect("/admin/appointments");
  }
  return { ok: false };
}
