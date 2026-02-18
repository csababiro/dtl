/**
 * Type for quote requests (cereri ofertă). Data from DB/API.
 */

export interface QuoteRequest {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  carMake: string;
  carModel: string;
  carYear: string;
  description: string;
  chassis?: string;
  photoUrl?: string;
  status?: string;
}
