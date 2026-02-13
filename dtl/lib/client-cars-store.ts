/**
 * Store for client cars (mașini per client). Used by admin client detail.
 */

export interface ClientCar {
  id: string;
  clientId: string;
  carMake: string;
  carModel: string;
  carYear: string;
  chassis?: string;
}

const DUMMY_CARS: ClientCar[] = [
  { id: "cc0a", clientId: "c0", carMake: "Demo", carModel: "Mașină", carYear: "2024" },
  { id: "cc1a", clientId: "c1", carMake: "VW", carModel: "Golf VII", carYear: "2019" },
  { id: "cc2a", clientId: "c2", carMake: "Dacia", carModel: "Duster", carYear: "2021" },
  { id: "cc2b", clientId: "c2", carMake: "Dacia", carModel: "Logan", carYear: "2018" },
  { id: "cc3a", clientId: "c3", carMake: "BMW", carModel: "320d", carYear: "2018" },
  { id: "cc4a", clientId: "c4", carMake: "Skoda", carModel: "Octavia", carYear: "2020" },
  { id: "cc5a", clientId: "c5", carMake: "Ford", carModel: "Focus", carYear: "2017" },
  { id: "cc6a", clientId: "c6", carMake: "Renault", carModel: "Megane", carYear: "2019" },
  { id: "cc7a", clientId: "c7", carMake: "Toyota", carModel: "Corolla", carYear: "2022" },
];

const store: ClientCar[] =
  typeof globalThis !== "undefined" &&
  (globalThis as unknown as { __clientCars?: ClientCar[] }).__clientCars
    ? (globalThis as unknown as { __clientCars: ClientCar[] }).__clientCars
    : ((globalThis as unknown as { __clientCars: ClientCar[] }).__clientCars =
        DUMMY_CARS.map((c) => ({ ...c })));

export function getCarsByClientId(clientId: string): ClientCar[] {
  return store.filter((c) => c.clientId === clientId).map((c) => ({ ...c }));
}

export function getCarById(id: string): ClientCar | null {
  const c = store.find((x) => x.id === id);
  return c ? { ...c } : null;
}

export function addClientCar(data: {
  clientId: string;
  carMake: string;
  carModel: string;
  carYear: string;
  chassis?: string;
}): ClientCar {
  const id = "cc-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
  const car: ClientCar = {
    id,
    clientId: data.clientId,
    carMake: data.carMake.trim(),
    carModel: data.carModel.trim(),
    carYear: data.carYear.trim(),
    chassis: data.chassis?.trim() || undefined,
  };
  store.push(car);
  return { ...car };
}

export function updateClientCar(
  id: string,
  data: Partial<{ carMake: string; carModel: string; carYear: string; chassis: string }>
): ClientCar | null {
  const c = store.find((x) => x.id === id);
  if (!c) return null;
  if (data.carMake !== undefined) c.carMake = data.carMake.trim();
  if (data.carModel !== undefined) c.carModel = data.carModel.trim();
  if (data.carYear !== undefined) c.carYear = data.carYear.trim();
  if (data.chassis !== undefined) c.chassis = data.chassis.trim() || undefined;
  return { ...c };
}

export function deleteClientCar(id: string): boolean {
  const idx = store.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}
