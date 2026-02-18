"use client";

import { useState, useEffect, useCallback } from "react";
import { getContactSettings, putContactSettings } from "@/lib/api/settings";
import type { ContactSettings } from "@/lib/contact-settings";
import type { ApiError } from "@/lib/api-client";

const DEFAULT_FORM: ContactSettings = {
  companyName: "",
  phone: "",
  email: "",
  address: "",
  whatsapp: "",
};

export function useContactSettings() {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getContactSettings();
    if ("data" in result && result.data) {
      setSettings((prev) => ({ ...prev, ...result.data }));
    } else if ("error" in result) {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const save = useCallback(
    async (body: ContactSettings | Partial<ContactSettings>) => {
      const result = await putContactSettings(body);
      if ("data" in result) {
        setSettings(result.data);
        return { data: result.data };
      }
      return { error: result.error };
    },
    []
  );

  return { settings, setSettings, loading, error, refetch, save };
}
