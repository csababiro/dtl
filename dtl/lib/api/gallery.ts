import { get, post, del } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import type { GalleryItem } from "@/lib/dummy-gallery";

export type { GalleryItem };

export async function getGalleryItems(): Promise<
  { data: GalleryItem[] } | { error: ApiError }
> {
  const result = await get<{ items: GalleryItem[] }>("/gallery");
  if ("error" in result) return { error: result.error };
  return { data: result.data.items };
}

export async function addGalleryItem(body: {
  imageUrl: string;
  title?: string;
  caption?: string;
}): Promise<{ data: GalleryItem } | { error: ApiError }> {
  return post<GalleryItem, typeof body>("/gallery", body);
}

export async function deleteGalleryItem(
  id: string
): Promise<{ data: void } | { error: ApiError }> {
  return del<void>(`/gallery/${id}`);
}
