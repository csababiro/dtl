/**
 * Dummy payments (plăți) per client for admin client profile (no API yet).
 */

export interface ClientPlata {
  id: string;
  clientId: string;
  /** Display number for invoice (6-digit number). */
  nrFactura: string;
  data: string;
  suma: string;
  descriere: string;
  /** Optional notes (client or admin editable). */
  notes?: string;
}

export const DUMMY_PLATI: ClientPlata[] = [
  { id: "p0a", clientId: "c0", nrFactura: "284591", data: "2025-02-10", suma: "380 RON", descriere: "Revizie + schimb ulei", notes: "Demo factură 1." },
  { id: "p0b", clientId: "c0", nrFactura: "391847", data: "2025-01-18", suma: "120 RON", descriere: "Schimb anvelope" },
  { id: "p0c", clientId: "c0", nrFactura: "502736", data: "2024-12-05", suma: "75 RON", descriere: "Spălare + ceră", notes: "" },
  { id: "p1", clientId: "c1", nrFactura: "618293", data: "2025-02-12", suma: "450 RON", descriere: "Revizie periodică", notes: "Plătit cu card. Am păstrat bonul." },
  { id: "p2", clientId: "c1", nrFactura: "729154", data: "2025-01-15", suma: "160 RON", descriere: "Schimb anvelope" },
  { id: "p10", clientId: "c1", nrFactura: "835062", data: "2024-12-20", suma: "320 RON", descriere: "Set anvelope iarnă + montaj", notes: "Anvelope stocate la service." },
  { id: "p3", clientId: "c2", nrFactura: "941378", data: "2025-02-12", suma: "160 RON", descriere: "Schimb anvelope", notes: "" },
  { id: "p11", clientId: "c2", nrFactura: "156420", data: "2025-01-08", suma: "80 RON", descriere: "Echilibrare + geometrie" },
  { id: "p12", clientId: "c2", nrFactura: "263891", data: "2024-11-15", suma: "70 RON", descriere: "Spălare completă" },
  { id: "p4", clientId: "c3", nrFactura: "374516", data: "2025-02-13", suma: "100 RON", descriere: "Diagnoză motor", notes: "De verificat frânele data viitoare." },
  { id: "p5", clientId: "c3", nrFactura: "485903", data: "2025-01-20", suma: "60 RON", descriere: "Echilibrare roți" },
  { id: "p13", clientId: "c3", nrFactura: "592641", data: "2024-12-28", suma: "180 RON", descriere: "Schimb anvelope" },
  { id: "p6", clientId: "c4", nrFactura: "607284", data: "2025-02-13", suma: "150 RON", descriere: "Plăcuțe frâne" },
  { id: "p16", clientId: "c4", nrFactura: "718953", data: "2025-01-05", suma: "95 RON", descriere: "Diagnoză + echilibrare" },
  { id: "p17", clientId: "c6", nrFactura: "824167", data: "2025-01-12", suma: "65 RON", descriere: "Spălare" },
  { id: "p7", clientId: "c5", nrFactura: "930428", data: "2025-02-14", suma: "90 RON", descriere: "Spălare + ceră", notes: "Recomand detailing la toamnă." },
  { id: "p14", clientId: "c5", nrFactura: "147596", data: "2025-01-10", suma: "55 RON", descriere: "Schimb filtru cabină" },
  { id: "p8", clientId: "c6", nrFactura: "258013", data: "2025-02-14", suma: "60 RON", descriere: "Echilibrare" },
  { id: "p9", clientId: "c7", nrFactura: "369742", data: "2025-02-15", suma: "450 RON", descriere: "Revizie", notes: "Următoarea revizie la 40.000 km." },
  { id: "p15", clientId: "c7", nrFactura: "470859", data: "2024-12-02", suma: "85 RON", descriere: "Spălare + ceră" },
];

export function getPlatiByClientId(clientId: string): ClientPlata[] {
  return DUMMY_PLATI.filter((p) => p.clientId === clientId);
}
