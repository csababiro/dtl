"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/api/testimonials";
import type { TestimonialItem } from "@/lib/dummy-testimonials";
import type { ApiError } from "@/lib/api-client";

export function useTestimonials() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getTestimonials();
    if ("data" in result) {
      setItems(result.data);
    } else {
      setError(result.error);
      setItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const add = useCallback(
    async (
      body: Partial<TestimonialItem> & { author: string; text: string }
    ) => {
      const result = await addTestimonial(body);
      if ("data" in result) {
        await refetch();
        return { data: result.data };
      }
      return { error: result.error };
    },
    [refetch]
  );

  const update = useCallback(
    async (id: string, body: Partial<TestimonialItem>) => {
      const result = await updateTestimonial(id, body);
      if ("data" in result) {
        await refetch();
        return { data: result.data };
      }
      return { error: result.error };
    },
    [refetch]
  );

  const remove = useCallback(
    async (id: string) => {
      const result = await deleteTestimonial(id);
      if ("error" in result) return { error: result.error };
      await refetch();
      return { data: undefined as void };
    },
    [refetch]
  );

  return { items, loading, error, refetch, add, update, remove };
}
