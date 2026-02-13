/**
 * Mutable in-memory store for appointments (admin approve flow).
 * Seeded from dummy data; shared by admin appointments page and calendar.
 */

import {
  type DummyAppointment,
  type DummyAppointmentStatus,
  DUMMY_APPOINTMENTS,
} from "@/lib/dummy-appointments";

const store: DummyAppointment[] =
  typeof globalThis !== "undefined" &&
  (globalThis as unknown as { __appointments?: DummyAppointment[] }).__appointments
    ? (globalThis as unknown as { __appointments: DummyAppointment[] }).__appointments
    : ((globalThis as unknown as { __appointments: DummyAppointment[] }).__appointments =
        DUMMY_APPOINTMENTS.map((a) => ({ ...a })));

export type { DummyAppointment, DummyAppointmentStatus };

export function getAppointments(): DummyAppointment[] {
  return [...store];
}

export function getAppointmentById(id: string): DummyAppointment | null {
  const item = store.find((a) => a.id === id);
  return item ? { ...item } : null;
}

/** Appointments for a client, matched by email (normalized lowercase). */
export function getAppointmentsByClientEmail(clientEmail: string): DummyAppointment[] {
  const email = clientEmail.trim().toLowerCase();
  return store.filter((a) => a.email.trim().toLowerCase() === email);
}

export function updateAppointmentStatus(
  id: string,
  status: DummyAppointmentStatus
): DummyAppointment | null {
  const item = store.find((a) => a.id === id);
  if (!item) return null;
  item.status = status;
  return item;
}

/** Update date and/or time. data format "d MMM yyyy", ora format "HH:mm". */
export function updateAppointmentDateTime(
  id: string,
  data: string,
  ora: string
): DummyAppointment | null {
  const item = store.find((a) => a.id === id);
  if (!item) return null;
  item.data = data;
  item.ora = ora;
  return item;
}

export function deleteAppointment(id: string): boolean {
  const idx = store.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}
