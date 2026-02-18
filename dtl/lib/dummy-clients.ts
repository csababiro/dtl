/**
 * Types for admin Clienți. Data from DB/API.
 */

export interface DummyClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  car?: string;
  programariCount: number;
  lastVisit?: string;
}
