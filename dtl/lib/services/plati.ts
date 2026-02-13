import type { ClientPlata } from "@/lib/dummy-plati";
import {
  getPlatiFromDb,
  getPlataByIdFromDb,
  getPlatiByClientIdFromDb,
  getPlatiByClientEmailFromDb,
  updatePlataNotesInDb,
} from "@/lib/db/plati";
import { withDbErrorHandling } from "./errors";

export async function getPlati(): Promise<
  { data: ClientPlata[] } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getPlatiFromDb());
}

export async function getPlataById(
  id: string
): Promise<
  { data: ClientPlata | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getPlataByIdFromDb(id));
}

export async function getPlatiByClientId(
  clientId: string
): Promise<
  { data: ClientPlata[] } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getPlatiByClientIdFromDb(clientId));
}

export async function getPlatiByClientEmail(
  clientEmail: string
): Promise<
  { data: ClientPlata[] } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getPlatiByClientEmailFromDb(clientEmail));
}

export async function updatePlataNotes(
  id: string,
  notes: string
): Promise<
  { data: ClientPlata | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => updatePlataNotesInDb(id, notes));
}
