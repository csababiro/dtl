"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getGalleryItems,
  addGalleryItem,
  deleteGalleryItem,
} from "@/lib/api/gallery";
import type { GalleryItem } from "@/lib/dummy-gallery";
import type { ApiError } from "@/lib/api-client";

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getGalleryItems();
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

  const addItem = useCallback(
    async (body: { imageUrl: string; title?: string; caption?: string }) => {
      const result = await addGalleryItem(body);
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
      const result = await deleteGalleryItem(id);
      if ("error" in result) return { error: result.error };
      await refetch();
      return { data: undefined as void };
    },
    [refetch]
  );

  return { items, loading, error, refetch, addItem, removeItem };
}
