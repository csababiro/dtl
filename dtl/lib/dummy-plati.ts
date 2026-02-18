/**
 * Types for payments (plăți) per client. Data from DB/API.
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
