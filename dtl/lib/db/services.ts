import type { ServiceCategoryId } from "@/lib/services-data";
import { sql } from "./index";

export interface ServiceRow {
  id: string;
  category: string;
  name: string;
  price: string;
  order: number;
}

function rowToService(r: Record<string, unknown>): ServiceRow {
  return {
    id: String(r.id),
    category: String(r.category ?? ""),
    name: String(r.name ?? ""),
    price: String(r.price ?? ""),
    order: Number(r.order ?? 0),
  };
}

export async function getServicesByCategoryFromDb(
  category: ServiceCategoryId
): Promise<ServiceRow[]> {
  const { rows } = await sql`
    SELECT * FROM services
    WHERE category = ${category}
    ORDER BY "order" ASC, id ASC
  `;
  return rows.map((r) => rowToService(r as Record<string, unknown>));
}

export async function getServiceByIdFromDb(id: string): Promise<ServiceRow | null> {
  const { rows } = await sql`SELECT * FROM services WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return rowToService(rows[0] as Record<string, unknown>);
}

export async function addServiceInDb(data: {
  category: ServiceCategoryId;
  name: string;
  price: string;
}): Promise<ServiceRow> {
  const id = "srv-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  const existing = await getServicesByCategoryFromDb(data.category);
  const order = existing.length === 0 ? 0 : Math.max(...existing.map((s) => s.order)) + 1;
  await sql`
    INSERT INTO services (id, category, name, price, "order")
    VALUES (${id}, ${data.category}, ${data.name}, ${data.price}, ${order})
  `;
  const row = await getServiceByIdFromDb(id);
  return row!;
}

export async function updateServiceInDb(
  id: string,
  data: { name?: string; price?: string }
): Promise<ServiceRow | null> {
  const current = await getServiceByIdFromDb(id);
  if (!current) return null;
  const name = data.name !== undefined ? data.name : current.name;
  const price = data.price !== undefined ? data.price : current.price;
  await sql`
    UPDATE services SET name = ${name}, price = ${price} WHERE id = ${id}
  `;
  return getServiceByIdFromDb(id);
}

export async function deleteServiceFromDb(id: string): Promise<boolean> {
  const { rows } = await sql`DELETE FROM services WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
