import type { ClientCar } from "@/lib/client-cars-store";
import {
  getCarsByClientIdFromDb,
  getCarByIdFromDb,
  addClientCarInDb,
  updateClientCarInDb,
  deleteClientCarFromDb,
} from "@/lib/db/client-cars";
import { withDbErrorHandling } from "./errors";

export async function getCarsByClientId(
  clientId: string
): Promise<
  { data: ClientCar[] } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getCarsByClientIdFromDb(clientId));
}

export async function getCarById(
  id: string
): Promise<
  { data: ClientCar | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getCarByIdFromDb(id));
}

export async function addClientCar(data: {
  clientId: string;
  carMake: string;
  carModel: string;
  carYear: string;
  chassis?: string;
}): Promise<{ data: ClientCar } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => addClientCarInDb(data));
}

export async function updateClientCar(
  id: string,
  data: Partial<{ carMake: string; carModel: string; carYear: string; chassis: string }>
): Promise<
  { data: ClientCar | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => updateClientCarInDb(id, data));
}

export async function deleteClientCar(
  id: string
): Promise<{ data: boolean } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => deleteClientCarFromDb(id));
}
