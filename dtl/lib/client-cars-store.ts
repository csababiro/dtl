/**
 * Type for client cars (mașini per client). Data from DB/API.
 */

export interface ClientCar {
  id: string;
  clientId: string;
  carMake: string;
  carModel: string;
  carYear: string;
  chassis?: string;
}
