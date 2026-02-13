import type { ClientCar } from "@/lib/client-cars-store";
import { sql } from "./index";

function rowToCar(r: Record<string, unknown>): ClientCar {
  return {
    id: String(r.id),
    clientId: String(r.client_id ?? ""),
    carMake: String(r.car_make ?? ""),
    carModel: String(r.car_model ?? ""),
    carYear: String(r.car_year ?? ""),
    chassis: r.chassis != null ? String(r.chassis) : undefined,
  };
}

export async function getCarsByClientIdFromDb(clientId: string): Promise<ClientCar[]> {
  const { rows } = await sql`SELECT * FROM client_cars WHERE client_id = ${clientId}`;
  return rows.map((r) => rowToCar(r as Record<string, unknown>));
}

export async function getCarByIdFromDb(id: string): Promise<ClientCar | null> {
  const { rows } = await sql`SELECT * FROM client_cars WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return rowToCar(rows[0] as Record<string, unknown>);
}

export async function addClientCarInDb(data: {
  clientId: string;
  carMake: string;
  carModel: string;
  carYear: string;
  chassis?: string;
}): Promise<ClientCar> {
  const id = "cc-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
  await sql`
    INSERT INTO client_cars (id, client_id, car_make, car_model, car_year, chassis)
    VALUES (${id}, ${data.clientId}, ${data.carMake.trim()}, ${data.carModel.trim()}, ${data.carYear.trim()}, ${data.chassis?.trim() ?? null})
  `;
  const c = await getCarByIdFromDb(id);
  return c!;
}

export async function updateClientCarInDb(
  id: string,
  data: Partial<{ carMake: string; carModel: string; carYear: string; chassis: string }>
): Promise<ClientCar | null> {
  const c = await getCarByIdFromDb(id);
  if (!c) return null;
  const carMake = data.carMake !== undefined ? data.carMake.trim() : c.carMake;
  const carModel = data.carModel !== undefined ? data.carModel.trim() : c.carModel;
  const carYear = data.carYear !== undefined ? data.carYear.trim() : c.carYear;
  const chassis = data.chassis !== undefined ? data.chassis.trim() || undefined : c.chassis;
  await sql`
    UPDATE client_cars SET car_make = ${carMake}, car_model = ${carModel}, car_year = ${carYear}, chassis = ${chassis ?? null}
    WHERE id = ${id}
  `;
  return getCarByIdFromDb(id);
}

export async function deleteClientCarFromDb(id: string): Promise<boolean> {
  const { rows } = await sql`DELETE FROM client_cars WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
