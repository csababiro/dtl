import type { TestimonialItem } from "@/lib/dummy-testimonials";
import { sql } from "./index";

function rowToItem(r: Record<string, unknown>): TestimonialItem {
  return {
    id: String(r.id),
    author: String(r.author ?? ""),
    role: r.role != null ? String(r.role) : undefined,
    text: String(r.content ?? ""),
    rating: r.rating != null ? Number(r.rating) : undefined,
    createdAt: String(r.created_at ?? ""),
    visible: Boolean(r.visible),
  };
}

export async function getTestimonialsFromDb(): Promise<TestimonialItem[]> {
  const { rows } = await sql`SELECT * FROM testimonials ORDER BY created_at DESC`;
  return rows.map((r) => rowToItem(r as Record<string, unknown>));
}

export async function getTestimonialByIdFromDb(id: string): Promise<TestimonialItem | null> {
  const { rows } = await sql`SELECT * FROM testimonials WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return rowToItem(rows[0] as Record<string, unknown>);
}

export async function addTestimonialInDb(
  data: Omit<TestimonialItem, "id" | "createdAt">
): Promise<TestimonialItem> {
  const id = "test-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  const createdAt = new Date().toISOString();
  await sql`
    INSERT INTO testimonials (id, author, role, content, rating, created_at, visible)
    VALUES (${id}, ${data.author}, ${data.role ?? null}, ${data.text}, ${data.rating ?? null}, ${createdAt}, ${data.visible ?? true})
  `;
  const item = await getTestimonialByIdFromDb(id);
  return item!;
}

export async function updateTestimonialInDb(
  id: string,
  updates: Partial<Omit<TestimonialItem, "id" | "createdAt">>
): Promise<TestimonialItem | null> {
  const current = await getTestimonialByIdFromDb(id);
  if (!current) return null;
  const author = updates.author ?? current.author;
  const role = updates.role !== undefined ? updates.role : current.role;
  const text = updates.text ?? current.text;
  const rating = updates.rating !== undefined ? updates.rating : current.rating;
  const visible = updates.visible ?? current.visible;
  await sql`
    UPDATE testimonials SET author = ${author}, role = ${role ?? null}, content = ${text}, rating = ${rating ?? null}, visible = ${visible}
    WHERE id = ${id}
  `;
  return getTestimonialByIdFromDb(id);
}

export async function removeTestimonialFromDb(id: string): Promise<boolean> {
  const { rows } = await sql`DELETE FROM testimonials WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
