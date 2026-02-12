import type { DummyAppointmentType } from "@/lib/dummy-appointments";

export const APPOINTMENT_TYPE_COLORS: Record<DummyAppointmentType, string> = {
  general: "#2563eb",
  tyre: "#d97706",
  carWash: "#0d9488",
};

export const APPOINTMENT_TYPE_LABELS: Record<DummyAppointmentType, string> = {
  general: "Service general",
  tyre: "Anvelope",
  carWash: "Spălătorie",
};

export const UNCONFIRMED_COLOR = "#dc2626";
