/**
 * Server-only: returns services from DB for customer-facing pages.
 * Returns empty array on error or if table is empty.
 */
import type { ServiceCategoryId } from "@/lib/services-data";
import { getServicesByCategory } from "@/lib/services";

export interface ServiceItemForDisplay {
  name: string;
  price: string;
}

export async function getServicesForDisplay(
  category: ServiceCategoryId
): Promise<ServiceItemForDisplay[]> {
  const result = await getServicesByCategory(category);
  if ("error" in result) return [];
  return result.data.map((s) => ({ name: s.name, price: s.price }));
}
