import { get, post, patch, del } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import type { TestimonialItem } from "@/lib/dummy-testimonials";

export type { TestimonialItem };

export async function getTestimonials(): Promise<
  { data: TestimonialItem[] } | { error: ApiError }
> {
  const result = await get<{ items: TestimonialItem[] }>("/testimonials");
  if ("error" in result) return { error: result.error };
  return { data: result.data.items };
}

export async function addTestimonial(body: Partial<TestimonialItem> & {
  author: string;
  text: string;
}): Promise<{ data: TestimonialItem } | { error: ApiError }> {
  return post<TestimonialItem, typeof body>("/testimonials", body);
}

export async function updateTestimonial(
  id: string,
  body: Partial<TestimonialItem>
): Promise<{ data: TestimonialItem } | { error: ApiError }> {
  return patch<TestimonialItem, typeof body>(`/testimonials/${id}`, body);
}

export async function deleteTestimonial(
  id: string
): Promise<{ data: void } | { error: ApiError }> {
  return del<void>(`/testimonials/${id}`);
}
