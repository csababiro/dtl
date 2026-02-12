/**
 * Testimonials store for admin. Persisted in localStorage; no API.
 * Seeds with dummy items when empty.
 */

import { DUMMY_TESTIMONIAL_ITEMS, type TestimonialItem } from "./dummy-testimonials";

const STORAGE_KEY = "dtl-testimonials";

function loadFromStorage(): TestimonialItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is TestimonialItem =>
        p != null &&
        typeof p === "object" &&
        "id" in p &&
        "author" in p &&
        "text" in p &&
        "createdAt" in p &&
        "visible" in p
    );
  } catch {
    return [];
  }
}

function saveToStorage(items: TestimonialItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

/** Get testimonials. Seeds with dummy data if storage is empty. */
export function getTestimonials(): TestimonialItem[] {
  const stored = loadFromStorage();
  if (stored.length > 0) return stored;
  saveToStorage(DUMMY_TESTIMONIAL_ITEMS);
  return DUMMY_TESTIMONIAL_ITEMS;
}

function nextId(): string {
  return "test-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

export function addTestimonial(
  item: Omit<TestimonialItem, "id" | "createdAt">
): TestimonialItem {
  const items = getTestimonials();
  const newItem: TestimonialItem = {
    ...item,
    id: nextId(),
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  saveToStorage(items);
  return newItem;
}

export function updateTestimonial(
  id: string,
  updates: Partial<Omit<TestimonialItem, "id" | "createdAt">>
): TestimonialItem | null {
  const items = getTestimonials();
  const index = items.findIndex((i) => i.id === id);
  if (index < 0) return null;
  items[index] = { ...items[index], ...updates };
  saveToStorage(items);
  return items[index];
}

export function removeTestimonial(id: string): void {
  const items = getTestimonials().filter((i) => i.id !== id);
  saveToStorage(items);
}
