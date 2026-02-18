import {
  getClientsFromDb,
  getClientByIdFromDb,
  getClientByEmailFromDb,
  ensureClientInDb,
  syncClientsFromAppointmentsInDb,
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

/** Create or update a client by email (e.g. when they book or submit a quote) so they appear in admin Clienți. */
export async function ensureClient(data: {
  name: string;
  email: string;
  phone: string;
  car?: string;
}): Promise<{ data: DummyClient } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => ensureClientInDb(data));
}

/** Create client rows for all distinct emails in appointments that don't have a client yet. Use once to backfill. */
export async function syncClientsFromAppointments(): Promise<
  { data: { created: number } } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => syncClientsFromAppointmentsInDb());
}
