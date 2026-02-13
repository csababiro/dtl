import { get, post, patch, del } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import type { DummyClient } from "@/lib/dummy-clients";
import type { ClientPlata } from "@/lib/dummy-plati";
import type { ClientCar } from "@/lib/client-cars-store";

export type { DummyClient, ClientPlata, ClientCar };

export async function getClients(): Promise<
  { data: DummyClient[] } | { error: ApiError }
> {
  const result = await get<{ items: DummyClient[] }>("/clients");
  if ("error" in result) return { error: result.error };
  return { data: result.data.items };
}

export async function getClientById(
  id: string
): Promise<{ data: DummyClient } | { error: ApiError }> {
  return get<DummyClient>(`/clients/${id}`);
}

export async function getClientPlati(
  clientId: string
): Promise<{ data: ClientPlata[] } | { error: ApiError }> {
  const result = await get<{ items: ClientPlata[] }>(`/clients/${clientId}/plati`);
  if ("error" in result) return { error: result.error };
  return { data: result.data.items };
}

export async function getClientCars(
  clientId: string
): Promise<{ data: ClientCar[] } | { error: ApiError }> {
  const result = await get<{ items: ClientCar[] }>(`/clients/${clientId}/cars`);
  if ("error" in result) return { error: result.error };
  return { data: result.data.items };
}

export async function addClientCar(
  clientId: string,
  body: { carMake: string; carModel: string; carYear: string; chassis?: string }
): Promise<{ data: ClientCar } | { error: ApiError }> {
  return post<ClientCar, typeof body>(`/clients/${clientId}/cars`, body);
}

export async function updateClientCar(
  clientId: string,
  carId: string,
  body: Partial<{ carMake: string; carModel: string; carYear: string; chassis: string }>
): Promise<{ data: ClientCar } | { error: ApiError }> {
  return patch<ClientCar, typeof body>(`/clients/${clientId}/cars/${carId}`, body);
}

export async function deleteClientCar(
  clientId: string,
  carId: string
): Promise<{ data: void } | { error: ApiError }> {
  return del<void>(`/clients/${clientId}/cars/${carId}`);
}
