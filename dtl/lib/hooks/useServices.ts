"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getServicesByCategory,
  addService,
  updateService,
  deleteService,
} from "@/lib/api/services";
import type { ServiceCategoryId } from "@/lib/services-data";
import type { ServiceRecord } from "@/lib/api/services";
import type { ApiError } from "@/lib/api-client";

export function useServices(category: ServiceCategoryId) {
  const [items, setItems] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getServicesByCategory(category);
    if ("data" in result) {
      setItems(result.data);
    } else {
      setError(result.error);
      setItems([]);
    }
    setLoading(false);
  }, [category]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addItem = useCallback(
    async (body: { name: string; price: string }) => {
      const result = await addService({
        category,
        name: body.name,
        price: body.price,
      });
      if ("data" in result) {
        await refetch();
        return { data: result.data };
      }
      return { error: result.error };
    },
    [category, refetch]
  );

  const updateItem = useCallback(
    async (id: string, body: { name?: string; price?: string }) => {
      const result = await updateService(id, body);
      if ("data" in result) {
        await refetch();
        return { data: result.data };
      }
      return { error: result.error };
    },
    [refetch]
  );

  const removeItem = useCallback(
    async (id: string) => {
      const result = await deleteService(id);
      if ("error" in result) return { error: result.error };
      await refetch();
      return { data: undefined as void };
    },
    [refetch]
  );

  return { items, loading, error, refetch, addItem, updateItem, removeItem };
}
