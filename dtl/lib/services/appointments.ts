import type { DummyAppointment, DummyAppointmentStatus } from "@/lib/dummy-appointments";
import {
  getAppointmentsFromDb,
  getAppointmentByIdFromDb,
  getAppointmentsByClientEmailFromDb,
  createAppointmentInDb,
  updateAppointmentStatusInDb,
  updateAppointmentDateTimeInDb,
  deleteAppointmentFromDb,
  updateAppointmentNotesInDb,
} from "@/lib/db/appointments";
import { withDbErrorHandling } from "./errors";

export async function getAppointments(): Promise<
  { data: DummyAppointment[] } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getAppointmentsFromDb());
}

export async function getAppointmentById(
  id: string
): Promise<
  { data: DummyAppointment | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getAppointmentByIdFromDb(id));
}

export async function getAppointmentsByClientEmail(
  clientEmail: string
): Promise<
  { data: DummyAppointment[] } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getAppointmentsByClientEmailFromDb(clientEmail));
}

export async function createAppointment(data: Parameters<typeof createAppointmentInDb>[0]): Promise<
  { data: DummyAppointment } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => createAppointmentInDb(data));
}

export async function updateAppointmentStatus(
  id: string,
  status: DummyAppointmentStatus
): Promise<
  { data: DummyAppointment | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => updateAppointmentStatusInDb(id, status));
}

export async function updateAppointmentDateTime(
  id: string,
  data: string,
  ora: string
): Promise<
  { data: DummyAppointment | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => updateAppointmentDateTimeInDb(id, data, ora));
}

export async function deleteAppointment(
  id: string
): Promise<{ data: boolean } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => deleteAppointmentFromDb(id));
}

export async function updateAppointmentNotes(
  id: string,
  data: { descriere?: string; clientNotes?: string }
): Promise<
  { data: DummyAppointment | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => updateAppointmentNotesInDb(id, data));
}
