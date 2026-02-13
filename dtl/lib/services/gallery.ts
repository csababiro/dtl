import type { GalleryItem } from "@/lib/dummy-gallery";
import {
  getGalleryItemsFromDb,
  getGalleryItemByIdFromDb,
  addGalleryItemInDb,
  removeGalleryItemFromDb,
} from "@/lib/db/gallery";
import { withDbErrorHandling } from "./errors";

export async function getGalleryItems(): Promise<
  { data: GalleryItem[] } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getGalleryItemsFromDb());
}

export async function getGalleryItemById(
  id: string
): Promise<
  { data: GalleryItem | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getGalleryItemByIdFromDb(id));
}

export async function addGalleryItem(data: {
  imageUrl: string;
  title?: string;
  caption?: string;
}): Promise<{ data: GalleryItem } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => addGalleryItemInDb(data));
}

export async function removeGalleryItem(
  id: string
): Promise<{ data: boolean } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => removeGalleryItemFromDb(id));
}
