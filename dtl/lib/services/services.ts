import type { ServiceCategoryId } from "@/lib/services-data";
import {
  getServicesByCategoryFromDb,
  getServiceByIdFromDb,
  addServiceInDb,
  updateServiceInDb,
  deleteServiceFromDb,
} from "@/lib/db/services";
import { withDbErrorHandling } from "./errors";

export interface ServiceRecord {
  id: string;
  category: ServiceCategoryId;
  name: string;
  price: string;
  order: number;
}

export async function getServicesByCategory(
  category: ServiceCategoryId
): Promise<
  { data: ServiceRecord[] } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(async () => {
    const rows = await getServicesByCategoryFromDb(category);
    return rows.map((r) => ({
      id: r.id,
      category: r.category as ServiceCategoryId,
      name: r.name,
      price: r.price,
      order: r.order,
    }));
  });
}

export async function getServiceById(
  id: string
): Promise<
  { data: ServiceRecord | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(async () => {
    const row = await getServiceByIdFromDb(id);
    if (!row) return null;
    return {
      id: row.id,
      category: row.category as ServiceCategoryId,
      name: row.name,
      price: row.price,
      order: row.order,
    };
  });
}

export async function addService(data: {
  category: ServiceCategoryId;
  name: string;
  price: string;
}): Promise<{ data: ServiceRecord } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() =>
    addServiceInDb({
      category: data.category,
      name: data.name.trim(),
      price: data.price.trim(),
    }).then((r) => ({
      id: r.id,
      category: r.category as ServiceCategoryId,
      name: r.name,
      price: r.price,
      order: r.order,
    }))
  );
}

export async function updateService(
  id: string,
  data: { name?: string; price?: string }
): Promise<{ data: ServiceRecord | null } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(async () => {
    const updated = await updateServiceInDb(id, {
      name: data.name?.trim(),
      price: data.price?.trim(),
    });
    if (!updated) return null;
    return {
      id: updated.id,
      category: updated.category as ServiceCategoryId,
      name: updated.name,
      price: updated.price,
      order: updated.order,
    };
  });
}

export async function deleteService(
  id: string
): Promise<{ data: boolean } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => deleteServiceFromDb(id));
}
