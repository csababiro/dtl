import type { QuoteRequest } from "@/lib/quote-requests-store";
import { sql } from "./index";

function rowToQuoteRequest(r: Record<string, unknown>): QuoteRequest {
  return {
    id: String(r.id),
    createdAt: String(r.created_at ?? ""),
    name: String(r.name ?? ""),
    phone: String(r.phone ?? ""),
    email: String(r.email ?? ""),
    carMake: String(r.car_make ?? ""),
    carModel: String(r.car_model ?? ""),
    carYear: String(r.car_year ?? ""),
    description: String(r.description ?? ""),
    chassis: r.chassis != null ? String(r.chassis) : undefined,
    photoUrl: r.photo_url != null ? String(r.photo_url) : undefined,
    status: r.status != null ? String(r.status) : undefined,
  };
}

export async function getQuoteRequestsFromDb(): Promise<QuoteRequest[]> {
  const { rows } = await sql`SELECT * FROM quote_requests ORDER BY created_at DESC`;
  return rows.map((r) => rowToQuoteRequest(r as Record<string, unknown>));
}

export async function getQuoteRequestByIdFromDb(id: string): Promise<QuoteRequest | null> {
  const { rows } = await sql`SELECT * FROM quote_requests WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return rowToQuoteRequest(rows[0] as Record<string, unknown>);
}

function nextId(): string {
  return "qr-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

export async function createQuoteRequestInDb(data: Omit<QuoteRequest, "id" | "createdAt">): Promise<QuoteRequest> {
  const id = nextId();
  const createdAt = new Date().toISOString();
  const status = data.status ?? "pending";
  await sql`
    INSERT INTO quote_requests (id, created_at, name, phone, email, car_make, car_model, car_year, description, chassis, photo_url, status)
    VALUES (${id}, ${createdAt}, ${data.name}, ${data.phone}, ${data.email}, ${data.carMake}, ${data.carModel}, ${data.carYear}, ${data.description}, ${data.chassis ?? null}, ${data.photoUrl ?? null}, ${status})
  `;
  return { ...data, id, createdAt, status };
}

export async function setQuoteRequestStatusInDb(id: string, status: string): Promise<QuoteRequest | null> {
  const { rows } = await sql`UPDATE quote_requests SET status = ${status} WHERE id = ${id} RETURNING *`;
  if (rows.length === 0) return null;
  return rowToQuoteRequest(rows[0] as Record<string, unknown>);
}

export async function getQuoteRequestsByEmailFromDb(clientEmail: string): Promise<QuoteRequest[]> {
  const email = clientEmail.trim().toLowerCase();
  const { rows } = await sql`SELECT * FROM quote_requests WHERE LOWER(TRIM(email)) = ${email} ORDER BY created_at DESC`;
  return rows.map((r) => rowToQuoteRequest(r as Record<string, unknown>));
}
