/**
 * Shared types for API responses and forms.
 */

export interface ServiceItem {
  id: string;
  name: string;
  price?: number | null;
  imageUrl?: string | null;
  description?: string | null;
}

export interface SlotResponse {
  slots: string[];
}

export type BookingType = "general" | "tyre" | "carWash";

export interface AppointmentRequestPayload {
  type: BookingType;
  name: string;
  phone: string;
  email: string;
  carMake: string;
  carModel: string;
  carYear: string;
  carProblem: string;
  optionalServiceIds?: string[];
  date: string;
  time: string;
  photoUrl?: string | null;
}
