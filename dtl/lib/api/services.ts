import { get, post, patch, del } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import type { ServiceCategoryId } from "@/lib/services-data";

export interface ServiceRecord {
  id: string;
  category: ServiceCategoryId;
  name: string;
  price: string;
  order: number;
}

export async function getServicesByCategory(
  category: ServiceCategoryId
): Promise<{ data: ServiceRecord[] } | { error: ApiError }> {
  const result = await get<{ items: ServiceRecord[] }>(
    "/services?category=" + encodeURIComponent(category)
  );
  if ("error" in result) return { error: result.error };
  return { data: result.data.items };
}

export async function addService(body: {
  category: ServiceCategoryId;
  name: string;
  price: string;
}): Promise<{ data: ServiceRecord } | { error: ApiError }> {
  return post<ServiceRecord, typeof body>("/services", body);
}

export async function updateService(
  id: string,
  body: { name?: string; price?: string }
): Promise<{ data: ServiceRecord } | { error: ApiError }> {
  return patch<ServiceRecord, typeof body>(`/services/${id}`, body);
}

export async function deleteService(
  id: string
): Promise<{ data: void } | { error: ApiError }> {
  return del<void>(`/services/${id}`);
}
