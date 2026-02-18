"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users as UsersIcon,
  ClipboardCheck,
  Calendar,
  Eye,
  Loader2,
} from "lucide-react";
import { t } from "@/lib/i18n";
import { getDashboardStats } from "@/lib/api/stats";
import type { DashboardStats } from "@/lib/api/stats";

type Period = "today" | "7days" | "month" | "year" | "all";

const PERIOD_OPTIONS: { value: Period; labelKey: string }[] = [
  { value: "today", labelKey: "admin.periodToday" },
  { value: "7days", labelKey: "admin.period7Days" },
  { value: "month", labelKey: "admin.periodMonth" },
  { value: "year", labelKey: "admin.periodYear" },
  { value: "all", labelKey: "admin.periodAll" },
];

function formatRevenue(n: number): string {
  if (n === 0) return "0 RON";
  return n % 1 === 0 ? `${n} RON` : `${n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} RON`;
}

function RevenueLineChart({ data }: { data: { name: string; venit: number }[] }) {
  const maxVenit = Math.max(...data.map((d) => d.venit), 1);
  const width = 100;
  const height = 80;
  const padding = { top: 4, right: 4, bottom: 4, left: 4 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1 || 1)) * chartWidth;
    const y = padding.top + chartHeight - (d.venit / maxVenit) * chartHeight;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(" L ")}`;

  return (
    <div className="h-[280px] flex flex-col">
      <div className="flex-1 min-h-0 flex items-stretch">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="revenueLineGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="rgb(100 116 139)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="rgb(100 116 139)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${pathD} L ${padding.left + chartWidth},${padding.top + chartHeight} L ${padding.left},${padding.top + chartHeight} Z`}
            fill="url(#revenueLineGrad)"
          />
          <path
            d={pathD}
            fill="none"
            stroke="rgb(100 116 139)"
            strokeWidth="1"
            strokeLinecap="butt"
            strokeLinejoin="miter"
          />
        </svg>
      </div>
      <div className="flex gap-1 mt-2 justify-between">
        {data.map((d) => (
          <span key={d.name} className="text-xs font-bold text-slate-500 flex-1 text-center">
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AdminDashboardClient() {
  const [period, setPeriod] = useState<Period>("today");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (p: Period) => {
    setLoading(true);
    setError(null);
    const result = await getDashboardStats(p);
    if ("data" in result) {
      setStats(result.data);
    } else {
      setError(result.error?.message ?? "Eroare la încărcare");
      setStats(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats(period);
  }, [period, fetchStats]);

  const statCards = stats
    ? [
        { labelKey: "admin.revenueToday" as const, val: formatRevenue(stats.revenueToday), icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
        { labelKey: "admin.newClients" as const, val: String(stats.newClients), icon: UsersIcon, color: "text-blue-600", bg: "bg-blue-100" },
        { labelKey: "admin.appointmentsCount" as const, val: String(stats.appointmentsCount), icon: ClipboardCheck, color: "text-purple-600", bg: "bg-purple-100" },
        { labelKey: "admin.visitors" as const, val: "—", icon: Eye, color: "text-slate-600", bg: "bg-slate-100" },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {t("admin.dashboardTitle")}
          </h1>
          <p className="text-slate-500 mt-1">
            {t("admin.dashboardSubtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPeriod(opt.value)}
              disabled={loading}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                period === opt.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              } disabled:opacity-60`}
            >
              {opt.value === "7days" && <Calendar size={14} />}
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && !stats ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-slate-400" size={32} />
          </div>
        ) : (
          statCards.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                {t(stat.labelKey)}
              </h4>
              <p className="text-3xl font-black text-slate-900">{stat.val}</p>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">
            {t("admin.revenueEvolution")}
          </h3>
          {stats ? (
            <RevenueLineChart data={stats.revenueByDay} />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-400">
              {loading ? <Loader2 className="animate-spin" size={28} /> : "—"}
            </div>
          )}
        </div>

        <Link
          href="/admin/appointments"
          className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col hover:bg-slate-50/50 transition-colors block"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            {t("admin.appointments")}
          </h3>
          {loading && !stats ? (
            <div className="flex justify-center py-8 flex-1">
              <Loader2 className="animate-spin text-slate-400" size={24} />
            </div>
          ) : (
            <p className="text-4xl font-black text-slate-900 mb-6">
              {stats ? stats.appointmentsCount : 0}
            </p>
          )}
          <span className="mt-auto py-3 bg-slate-50 text-slate-600 font-bold rounded-xl text-center text-sm">
            {t("admin.viewAllAppointments")}
          </span>
        </Link>
      </div>
    </div>
  );
}
