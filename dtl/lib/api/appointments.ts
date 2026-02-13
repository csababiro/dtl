import { get, patch, del } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import type { DummyAppointment } from "@/lib/dummy-appointments";

export type { DummyAppointment };

export async function getAppointments(): Promise<
  { data: DummyAppointment[] } | { error: ApiError }
> {
  const result = await get<{ items: DummyAppointment[] }>("/appointments");
  if ("error" in result) return { error: result.error };
  return { data: result.data.items };
}

export async function getAppointmentById(
  id: string
): Promise<{ data: DummyAppointment } | { error: ApiError }> {
  return get<DummyAppointment>(`/appointments/${id}`);
}

export async function updateAppointment(
  id: string,
  body: Partial<DummyAppointment>
): Promise<{ data: DummyAppointment } | { error: ApiError }> {
  return patch<DummyAppointment, typeof body>(`/appointments/${id}`, body);
}

export async function deleteAppointment(
  id: string
): Promise<{ data: void } | { error: ApiError }> {
  return del<void>(`/appointments/${id}`);
}
