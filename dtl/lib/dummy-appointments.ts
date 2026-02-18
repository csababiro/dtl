/**
 * Types for appointments (admin Calendar and Programări). Data from DB/API.
 */

export type DummyAppointmentStatus = "Confirmat" | "În așteptare";
export type DummyAppointmentType = "general" | "tyre" | "carWash";

export interface DummyAppointment {
  id: string;
  nume: string;
  telefon: string;
  email: string;
  data: string;
  ora: string;
  marca: string;
  model: string;
  tip: DummyAppointmentType;
  status: DummyAppointmentStatus;
  descriere?: string;
  /** Client's or admin-editable notes (istoric). */
  clientNotes?: string;
}
