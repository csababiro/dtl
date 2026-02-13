import type { GalleryItem } from "@/lib/dummy-gallery";
import { sql } from "./index";

function rowToItem(r: Record<string, unknown>): GalleryItem {
  return {
    id: String(r.id),
    title: String(r.title ?? ""),
    caption: r.caption != null ? String(r.caption) : undefined,
    imageUrl: String(r.image_url ?? ""),
    order: Number(r.order ?? 0),
    createdAt: String(r.created_at ?? ""),
  };
}

export async function getGalleryItemsFromDb(): Promise<GalleryItem[]> {
  const { rows } = await sql`SELECT * FROM gallery_items ORDER BY "order" ASC, created_at ASC`;
  return rows.map((r) => rowToItem(r as Record<string, unknown>));
}

export async function getGalleryItemByIdFromDb(id: string): Promise<GalleryItem | null> {
  const { rows } = await sql`SELECT * FROM gallery_items WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return rowToItem(rows[0] as Record<string, unknown>);
}

export async function addGalleryItemInDb(data: {
  imageUrl: string;
  title?: string;
  caption?: string;
}): Promise<GalleryItem> {
  const id = "gal-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  const title = data.title ?? "";
  const caption = data.caption ?? null;
  const createdAt = new Date().toISOString();
  const items = await getGalleryItemsFromDb();
  const order = items.length === 0 ? 1 : Math.max(...items.map((i) => i.order)) + 1;
  await sql`
    INSERT INTO gallery_items (id, title, caption, image_url, "order", created_at)
    VALUES (${id}, ${title}, ${caption}, ${data.imageUrl}, ${order}, ${createdAt})
  `;
  const item = await getGalleryItemByIdFromDb(id);
  return item!;
}

export async function removeGalleryItemFromDb(id: string): Promise<boolean> {
  const { rows } = await sql`DELETE FROM gallery_items WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
