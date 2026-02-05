import { get } from "./api-client";
import type { ServiceItem } from "./types";

export async function getGeneralServices(): Promise<ServiceItem[]> {
  const result = await get<{ items: ServiceItem[] }>("/services/general");
  if ("error" in result) return [];
  return result.data?.items ?? [];
}

export async function getTyreServices(): Promise<ServiceItem[]> {
  const result = await get<{ items: ServiceItem[] }>("/services/tyre");
  if ("error" in result) return [];
  return result.data?.items ?? [];
}

export async function getCarWashServices(): Promise<ServiceItem[]> {
  const result = await get<{ items: ServiceItem[] }>("/services/car-wash");
  if ("error" in result) return [];
  return result.data?.items ?? [];
}
