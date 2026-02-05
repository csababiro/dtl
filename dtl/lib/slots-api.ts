import { get } from "./api-client";
import type { SlotResponse } from "./types";
import type { BookingType } from "./types";

export async function getAvailableSlots(
  type: BookingType,
  date: string
): Promise<string[]> {
  const result = await get<SlotResponse>(
    `/slots?type=${encodeURIComponent(type)}&date=${encodeURIComponent(date)}`
  );
  if ("error" in result) return [];
  return result.data?.slots ?? [];
}
