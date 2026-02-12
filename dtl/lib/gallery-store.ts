/**
 * Gallery items store for admin. Persisted in localStorage; no API.
 * Seeds with dummy items when empty.
 */

import { DUMMY_GALLERY_ITEMS, type GalleryItem } from "./dummy-gallery";

const STORAGE_KEY = "dtl-gallery";

function loadFromStorage(): GalleryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is GalleryItem =>
        p != null &&
        typeof p === "object" &&
        "id" in p &&
        "title" in p &&
        "imageUrl" in p &&
        "order" in p &&
        "createdAt" in p
    );
  } catch {
    return [];
  }
}

function saveToStorage(items: GalleryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

/** Get gallery items. Seeds with dummy data if storage is empty. */
export function getGalleryItems(): GalleryItem[] {
  const stored = loadFromStorage();
  if (stored.length > 0) return stored;
  saveToStorage(DUMMY_GALLERY_ITEMS);
  return DUMMY_GALLERY_ITEMS;
}

export function setGalleryItems(items: GalleryItem[]): void {
  saveToStorage(items);
}

function nextId(): string {
  return "gal-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

export function addGalleryItem(item: Omit<GalleryItem, "id" | "createdAt" | "order">): GalleryItem {
  const items = getGalleryItems();
  const maxOrder = items.length === 0 ? 0 : Math.max(...items.map((i) => i.order));
  const newItem: GalleryItem = {
    ...item,
    id: nextId(),
    order: maxOrder + 1,
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  saveToStorage(items);
  return newItem;
}

export function removeGalleryItem(id: string): void {
  const items = getGalleryItems().filter((i) => i.id !== id);
  saveToStorage(items);
}
