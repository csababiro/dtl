/**
 * Server-side in-memory gallery store for API routes.
 * Seeded from dummy data; persists for the lifetime of the process.
 */

import { DUMMY_GALLERY_ITEMS, type GalleryItem } from "./dummy-gallery";

declare global {
  // eslint-disable-next-line no-var
  var __galleryServerItems: GalleryItem[] | undefined;
}

function getStore(): GalleryItem[] {
  if (typeof globalThis !== "undefined" && globalThis.__galleryServerItems) {
    return globalThis.__galleryServerItems;
  }
  const seed = DUMMY_GALLERY_ITEMS.map((i) => ({ ...i }));
  if (typeof globalThis !== "undefined") globalThis.__galleryServerItems = seed;
  return seed;
}

export function getGalleryItemsServer(): GalleryItem[] {
  return getStore().map((i) => ({ ...i }));
}

function nextId(): string {
  return "gal-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

export function addGalleryItemServer(
  item: Omit<GalleryItem, "id" | "createdAt" | "order">
): GalleryItem {
  const store = getStore();
  const maxOrder = store.length === 0 ? 0 : Math.max(...store.map((i) => i.order));
  const newItem: GalleryItem = {
    ...item,
    title: item.title ?? "",
    id: nextId(),
    order: maxOrder + 1,
    createdAt: new Date().toISOString(),
  };
  store.push(newItem);
  return { ...newItem };
}

export function removeGalleryItemServer(id: string): boolean {
  const store = getStore();
  const idx = store.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}

export function getGalleryItemByIdServer(id: string): GalleryItem | null {
  const item = getStore().find((i) => i.id === id);
  return item ? { ...item } : null;
}
