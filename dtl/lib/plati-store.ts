/**
 * Mutable in-memory store for plăți (facturi). Used by admin client detail and cont (facturi).
 */

import type { ClientPlata } from "@/lib/dummy-plati";
import { DUMMY_PLATI } from "@/lib/dummy-plati";
import { getClientByEmail } from "@/lib/dummy-clients";

const store: ClientPlata[] =
  typeof globalThis !== "undefined" &&
  (globalThis as unknown as { __plati?: ClientPlata[] }).__plati
    ? (globalThis as unknown as { __plati: ClientPlata[] }).__plati
    : ((globalThis as unknown as { __plati: ClientPlata[] }).__plati =
        DUMMY_PLATI.map((p) => ({ ...p })));

export type { ClientPlata };

/** Ensure returned plata has nrFactura (from current DUMMY_PLATI if store had old data). */
function withNrFactura(p: ClientPlata): ClientPlata {
  if (p.nrFactura != null && p.nrFactura !== "") return { ...p };
  const fromDummy = DUMMY_PLATI.find((d) => d.id === p.id);
  return { ...p, nrFactura: fromDummy?.nrFactura ?? p.id };
}

export function getPlati(): ClientPlata[] {
  return store.map((p) => withNrFactura({ ...p }));
}

export function getPlataById(id: string): ClientPlata | null {
  const p = store.find((x) => x.id === id);
  return p ? withNrFactura({ ...p }) : null;
}

export function getPlatiByClientId(clientId: string): ClientPlata[] {
  return store.filter((p) => p.clientId === clientId).map((p) => withNrFactura({ ...p }));
}

/** Get plăți for a client by email (matches client by email then by clientId). */
export function getPlatiByClientEmail(clientEmail: string): ClientPlata[] {
  const client = getClientByEmail(clientEmail);
  if (!client) return [];
  return getPlatiByClientId(client.id);
}

export function updatePlataNotes(id: string, notes: string): ClientPlata | null {
  const p = store.find((x) => x.id === id);
  if (!p) return null;
  p.notes = notes;
  return { ...p };
}
