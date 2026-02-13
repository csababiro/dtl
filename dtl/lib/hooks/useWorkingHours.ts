"use client";

import { useState, useEffect, useCallback } from "react";
import { getWorkingHours, putWorkingHours } from "@/lib/api/settings";
import type { WorkingHoursSchedule } from "@/lib/working-hours";
import type { ApiError } from "@/lib/api-client";

const DEFAULT_DAY = { start: "08:00", end: "17:00" };
const DEFAULT_SCHEDULE: WorkingHoursSchedule = {
  days: [DEFAULT_DAY, DEFAULT_DAY, DEFAULT_DAY, DEFAULT_DAY, DEFAULT_DAY, DEFAULT_DAY],
};

export function useWorkingHours() {
  const [schedule, setSchedule] = useState<WorkingHoursSchedule>(DEFAULT_SCHEDULE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getWorkingHours();
    if ("data" in result && result.data?.days?.length >= 6) {
      setSchedule(result.data);
    } else if ("error" in result) {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const save = useCallback(
    async (body: WorkingHoursSchedule) => {
      const result = await putWorkingHours(body);
      if ("data" in result) {
        setSchedule(result.data);
        return { data: result.data };
      }
      return { error: result.error };
    },
    []
  );

  return { schedule, setSchedule, loading, error, refetch, save };
}
