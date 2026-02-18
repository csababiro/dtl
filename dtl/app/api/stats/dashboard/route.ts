import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/services";
import { getAuthFromRequest } from "@/lib/auth/jwt";
import type { DashboardPeriod } from "@/lib/services/stats";

export const dynamic = "force-dynamic";

const PERIODS: DashboardPeriod[] = ["today", "7days", "month", "year", "all"];

function isPeriod(s: string): s is DashboardPeriod {
  return PERIODS.includes(s as DashboardPeriod);
}

export async function GET(request: Request) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") ?? "7days").toLowerCase();
  const validPeriod = isPeriod(period) ? period : "7days";
  const result = await getDashboardStats(validPeriod);
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json(result.data);
}
