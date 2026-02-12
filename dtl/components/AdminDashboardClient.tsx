"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users as UsersIcon,
  ClipboardCheck,
  Calendar,
  Eye,
} from "lucide-react";
import { t } from "@/lib/i18n";

type Period = "today" | "7days" | "month" | "year" | "all";

const PERIOD_OPTIONS: { value: Period; labelKey: string }[] = [
  { value: "today", labelKey: "admin.periodToday" },
  { value: "7days", labelKey: "admin.period7Days" },
  { value: "month", labelKey: "admin.periodMonth" },
  { value: "year", labelKey: "admin.periodYear" },
  { value: "all", labelKey: "admin.periodAll" },
];

const REVENUE_LINE_DATA = [
  { name: "Lun", venit: 4000 },
  { name: "Mar", venit: 3000 },
  { name: "Mie", venit: 2000 },
  { name: "Joi", venit: 2780 },
  { name: "Vin", venit: 1890 },
  { name: "Sâm", venit: 2390 },
  { name: "Dum", venit: 0 },
];

const DUMMY_RECENT_APPOINTMENTS = [
  { id: "1", nume: "Maria Popescu", marca: "VW Golf", data: "12 Feb 2025", status: "Confirmat" as const },
  { id: "2", nume: "Ion Ionescu", marca: "Dacia Duster", data: "11 Feb 2025", status: "Solicitat" as const },
  { id: "3", nume: "Elena Marin", marca: "BMW 320", data: "10 Feb 2025", status: "Confirmat" as const },
  { id: "4", nume: "Andrei Stan", marca: "Skoda Octavia", data: "9 Feb 2025", status: "Solicitat" as const },
];

const STAT_CARDS_BASE = [
  { labelKey: "admin.revenueToday", val: "4.250 RON", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
  { labelKey: "admin.newClients", val: "12", icon: UsersIcon, color: "text-blue-600", bg: "bg-blue-100" },
  { labelKey: "admin.appointmentsCount", val: "28", icon: ClipboardCheck, color: "text-purple-600", bg: "bg-purple-100" },
  { labelKey: "admin.visitors", val: "—", icon: Eye, color: "text-slate-600", bg: "bg-slate-100", noApi: true },
];

function RevenueLineChart() {
  const data = REVENUE_LINE_DATA;
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
  const [period, setPeriod] = useState<Period>("7days");

  const periodLabel = PERIOD_OPTIONS.find((p) => p.value === period)?.labelKey ?? "admin.period7Days";

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
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                period === opt.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {opt.value === "7days" && <Calendar size={14} />}
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS_BASE.map((stat, i) => (
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
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">
            {t("admin.revenueEvolution")}
          </h3>
          <RevenueLineChart />
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">
            {t("admin.recentAppointments")}
          </h3>
          <div className="space-y-6">
            {DUMMY_RECENT_APPOINTMENTS.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">
                    {item.nume[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">
                      {item.nume}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {item.marca} • {item.data}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 ${
                    item.status === "Confirmat"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.status === "Confirmat"
                    ? t("admin.confirmed")
                    : t("admin.pending")}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/admin/appointments"
            className="block w-full mt-8 py-3 bg-slate-50 text-slate-500 font-bold rounded-xl text-center text-sm hover:bg-slate-100 transition-colors"
          >
            {t("admin.viewAllAppointments")}
          </Link>
        </div>
      </div>
    </div>
  );
}
