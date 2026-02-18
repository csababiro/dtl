import { format, parse, isWithinInterval, startOfDay, subDays } from "date-fns";
import { enUS } from "date-fns/locale";
import { getAppointments } from "./appointments";
import { getClients } from "./clients";
import { getPlati } from "./plati";
import { withDbErrorHandling } from "./errors";

export type DashboardPeriod = "today" | "7days" | "month" | "year" | "all";

export interface DashboardStats {
  revenueToday: number;
  newClients: number;
  appointmentsCount: number;
  revenueByDay: { name: string; venit: number }[];
  recentAppointments: { id: string; nume: string; marca: string; data: string; status: string }[];
}

const DAY_NAMES_RO = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];

function parsePlataDate(dataStr: string): Date | null {
  const s = String(dataStr ?? "").trim();
  if (!s) return null;
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return parse(s, "yyyy-MM-dd", new Date());
    }
    return parse(s, "d MMM yyyy", new Date(), { locale: enUS });
  } catch {
    return null;
  }
}

function parseSumaToNumber(suma: string): number {
  const s = String(suma ?? "").replace(/,/g, ".");
  const match = s.match(/[\d.]+/);
  if (!match) return 0;
  const n = parseFloat(match[0]);
  return Number.isFinite(n) ? n : 0;
}

function getDateKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export async function getDashboardStats(
  period: DashboardPeriod
): Promise<
  { data: DashboardStats } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(async () => {
    const [appointmentsResult, clientsResult, platiResult] = await Promise.all([
      getAppointments(),
      getClients(),
      getPlati(),
    ]);
    if ("error" in appointmentsResult) throw new Error(appointmentsResult.error.message);
    if ("error" in clientsResult) throw new Error(clientsResult.error.message);
    if ("error" in platiResult) throw new Error(platiResult.error.message);
    const appointments = appointmentsResult.data;
    const clients = clientsResult.data;
    const plati = platiResult.data;

    const now = new Date();
    const todayStart = startOfDay(now);

    const revenueToday = plati.reduce((sum, p) => {
      const d = parsePlataDate(p.data);
      if (!d) return sum;
      const key = getDateKey(d);
      const todayKey = getDateKey(now);
      return key === todayKey ? sum + parseSumaToNumber(p.suma) : sum;
    }, 0);

    const last7Start = startOfDay(subDays(now, 6));
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(now, 6 - i));
    const revenueByDay = last7Days.map((d) => {
      const key = getDateKey(d);
      const venit = plati.reduce((sum, p) => {
        const pd = parsePlataDate(p.data);
        if (!pd) return sum;
        return getDateKey(pd) === key ? sum + parseSumaToNumber(p.suma) : sum;
      }, 0);
      const dayName = DAY_NAMES_RO[d.getDay()];
      return { name: dayName, venit: Math.round(venit * 100) / 100 };
    });

    let filteredAppointments = appointments;
    if (period === "today") {
      filteredAppointments = appointments.filter((a) => {
        const d = parse(a.data, "d MMM yyyy", new Date(), { locale: enUS });
        return getDateKey(d) === getDateKey(now);
      });
    } else if (period === "7days") {
      filteredAppointments = appointments.filter((a) => {
        try {
          const d = parse(a.data, "d MMM yyyy", new Date(), { locale: enUS });
          return isWithinInterval(d, { start: last7Start, end: now });
        } catch {
          return false;
        }
      });
    } else if (period === "month") {
      const monthStart = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
      filteredAppointments = appointments.filter((a) => {
        try {
          const d = parse(a.data, "d MMM yyyy", new Date(), { locale: enUS });
          return isWithinInterval(d, { start: monthStart, end: now });
        } catch {
          return false;
        }
      });
    } else if (period === "year") {
      const yearStart = startOfDay(new Date(now.getFullYear(), 0, 1));
      filteredAppointments = appointments.filter((a) => {
        try {
          const d = parse(a.data, "d MMM yyyy", new Date(), { locale: enUS });
          return isWithinInterval(d, { start: yearStart, end: now });
        } catch {
          return false;
        }
      });
    }

    const recentAppointments = appointments
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        nume: a.nume,
        marca: a.marca || a.model ? [a.marca, a.model].filter(Boolean).join(" ") : "—",
        data: a.data,
        status: a.status,
      }));

    return {
      revenueToday: Math.round(revenueToday * 100) / 100,
      newClients: clients.length,
      appointmentsCount: filteredAppointments.length,
      revenueByDay,
      recentAppointments,
    };
  });
}
