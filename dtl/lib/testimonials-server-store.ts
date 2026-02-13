/**
 * Server-side in-memory testimonials store for API routes.
 * Seeded from dummy data; persists for the lifetime of the process.
 */

import { DUMMY_TESTIMONIAL_ITEMS, type TestimonialItem } from "./dummy-testimonials";

declare global {
  // eslint-disable-next-line no-var
  var __testimonialsServerItems: TestimonialItem[] | undefined;
}

function getStore(): TestimonialItem[] {
  if (typeof globalThis !== "undefined" && globalThis.__testimonialsServerItems) {
    return globalThis.__testimonialsServerItems;
  }
  const seed = DUMMY_TESTIMONIAL_ITEMS.map((i) => ({ ...i }));
  if (typeof globalThis !== "undefined") globalThis.__testimonialsServerItems = seed;
  return seed;
}

export function getTestimonialsServer(): TestimonialItem[] {
  return getStore().map((i) => ({ ...i }));
}

function nextId(): string {
  return "test-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

export function addTestimonialServer(
  item: Omit<TestimonialItem, "id" | "createdAt">
): TestimonialItem {
  const store = getStore();
  const newItem: TestimonialItem = {
    ...item,
    id: nextId(),
    createdAt: new Date().toISOString(),
  };
  store.push(newItem);
  return { ...newItem };
}

export function updateTestimonialServer(
  id: string,
  updates: Partial<Omit<TestimonialItem, "id" | "createdAt">>
): TestimonialItem | null {
  const store = getStore();
  const index = store.findIndex((i) => i.id === id);
  if (index < 0) return null;
  store[index] = { ...store[index], ...updates };
  return { ...store[index] };
}

export function removeTestimonialServer(id: string): boolean {
  const store = getStore();
  const idx = store.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}

export function getTestimonialByIdServer(id: string): TestimonialItem | null {
  const item = getStore().find((i) => i.id === id);
  return item ? { ...item } : null;
}
