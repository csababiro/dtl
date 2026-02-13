import { get, patch } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import type { ClientPlata } from "@/lib/dummy-plati";

export type { ClientPlata };

export async function getPlataById(
  id: string
): Promise<{ data: ClientPlata } | { error: ApiError }> {
  return get<ClientPlata>(`/plati/${id}`);
}

export async function updatePlataNotes(
  id: string,
  notes: string
): Promise<{ data: ClientPlata } | { error: ApiError }> {
  return patch<ClientPlata, { notes: string }>(`/plati/${id}`, { notes });
}
