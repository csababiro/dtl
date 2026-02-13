/**
 * Dummy payments (plăți) per client for admin client profile (no API yet).
 */

export interface ClientPlata {
  id: string;
  clientId: string;
  data: string;
  suma: string;
  descriere: string;
}

export const DUMMY_PLATI: ClientPlata[] = [
  { id: "p1", clientId: "c1", data: "2025-02-12", suma: "450 RON", descriere: "Revizie periodică" },
  { id: "p2", clientId: "c1", data: "2025-01-15", suma: "160 RON", descriere: "Schimb anvelope" },
  { id: "p3", clientId: "c2", data: "2025-02-12", suma: "160 RON", descriere: "Schimb anvelope" },
  { id: "p4", clientId: "c3", data: "2025-02-13", suma: "100 RON", descriere: "Diagnoză motor" },
  { id: "p5", clientId: "c3", data: "2025-01-20", suma: "60 RON", descriere: "Echilibrare roți" },
  { id: "p6", clientId: "c4", data: "2025-02-13", suma: "150 RON", descriere: "Plăcuțe frâne" },
  { id: "p7", clientId: "c5", data: "2025-02-14", suma: "90 RON", descriere: "Spălare + ceră" },
  { id: "p8", clientId: "c6", data: "2025-02-14", suma: "60 RON", descriere: "Echilibrare" },
  { id: "p9", clientId: "c7", data: "2025-02-15", suma: "450 RON", descriere: "Revizie" },
];

export function getPlatiByClientId(clientId: string): ClientPlata[] {
  return DUMMY_PLATI.filter((p) => p.clientId === clientId);
}
