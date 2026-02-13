import {
  getClientsFromDb,
  getClientByIdFromDb,
  getClientByEmailFromDb,
} from "@/lib/db/clients";
import { withDbErrorHandling } from "./errors";
import type { DummyClient } from "@/lib/dummy-clients";

export async function getClients(): Promise<
  { data: DummyClient[] } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getClientsFromDb());
}

export async function getClientById(
  id: string
): Promise<
  { data: DummyClient | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getClientByIdFromDb(id));
}

export async function getClientByEmail(
  email: string
): Promise<
  { data: DummyClient | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getClientByEmailFromDb(email));
}
