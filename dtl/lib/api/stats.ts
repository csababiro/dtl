import { get } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";

export type DashboardPeriod = "today" | "7days" | "month" | "year" | "all";

export interface DashboardStats {
  revenueToday: number;
  newClients: number;
  appointmentsCount: number;
  revenueByDay: { name: string; venit: number }[];
  recentAppointments: { id: string; nume: string; marca: string; data: string; status: string }[];
}

export async function getDashboardStats(
  period: DashboardPeriod
): Promise<{ data: DashboardStats } | { error: ApiError }> {
  const result = await get<DashboardStats>(
    "/stats/dashboard?period=" + encodeURIComponent(period)
  );
  if ("error" in result) return { error: result.error };
  return { data: result.data };
}
