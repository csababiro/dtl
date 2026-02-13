import type { TestimonialItem } from "@/lib/dummy-testimonials";
import {
  getTestimonialsFromDb,
  getTestimonialByIdFromDb,
  addTestimonialInDb,
  updateTestimonialInDb,
  removeTestimonialFromDb,
} from "@/lib/db/testimonials";
import { withDbErrorHandling } from "./errors";

export async function getTestimonials(): Promise<
  { data: TestimonialItem[] } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getTestimonialsFromDb());
}

export async function getTestimonialById(
  id: string
): Promise<
  { data: TestimonialItem | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getTestimonialByIdFromDb(id));
}

export async function addTestimonial(
  data: Omit<TestimonialItem, "id" | "createdAt">
): Promise<{ data: TestimonialItem } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => addTestimonialInDb(data));
}

export async function updateTestimonial(
  id: string,
  updates: Partial<Omit<TestimonialItem, "id" | "createdAt">>
): Promise<
  { data: TestimonialItem | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => updateTestimonialInDb(id, updates));
}

export async function removeTestimonial(
  id: string
): Promise<{ data: boolean } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => removeTestimonialFromDb(id));
}
