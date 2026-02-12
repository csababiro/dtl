import Link from "next/link";
import {
  TrendingUp,
  Users as UsersIcon,
  ClipboardCheck,
  Clock,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import { t } from "@/lib/i18n";

const WEEKLY_REVENUE = [
  { name: "Lun", venit: 4000 },
  { name: "Mar", venit: 3000 },
  { name: "Mie", venit: 2000 },
  { name: "Joi", venit: 2780 },
  { name: "Vin", venit: 1890 },
  { name: "Sâm", venit: 2390 },
  { name: "Dum", venit: 0 },
];

const maxVenit = Math.max(...WEEKLY_REVENUE.map((d) => d.venit));

const DUMMY_RECENT_APPOINTMENTS = [
  { id: "1", nume: "Maria Popescu", marca: "VW Golf", data: "12 Feb 2025", status: "Confirmat" as const },
  { id: "2", nume: "Ion Ionescu", marca: "Dacia Duster", data: "11 Feb 2025", status: "Solicitat" as const },
  { id: "3", nume: "Elena Marin", marca: "BMW 320", data: "10 Feb 2025", status: "Confirmat" as const },
  { id: "4", nume: "Andrei Stan", marca: "Skoda Octavia", data: "9 Feb 2025", status: "Solicitat" as const },
];

const STAT_CARDS = [
  { labelKey: "admin.revenueToday", val: "4.250 RON", trend: "+12%", up: true, icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
  { labelKey: "admin.newClients", val: "12", trend: "+4%", up: true, icon: UsersIcon, color: "text-blue-600", bg: "bg-blue-100" },
  { labelKey: "admin.appointmentsCount", val: "28", trend: "+2%", up: true, icon: ClipboardCheck, color: "text-purple-600", bg: "bg-purple-100" },
  { labelKey: "admin.avgTime", val: "1.5h", trend: "+0%", up: true, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
];

export default function AdminDashboardPage() {
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
        <div className="flex items-center gap-3">
          <span className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2">
            <Calendar size={16} /> {t("admin.last7Days")}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-green-500">
                <ArrowUpRight size={16} />
                {stat.trend}
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
        {/* Revenue chart (simple bars) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">
            {t("admin.revenueEvolution")}
          </h3>
          <div className="h-[280px] flex items-end gap-3">
            {WEEKLY_REVENUE.map((d) => (
              <div
                key={d.name}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <span className="text-xs font-semibold text-slate-400">
                  {d.venit > 0 ? `${(d.venit / 1000).toFixed(1)}k` : "0"}
                </span>
                <div
                  className="w-full bg-slate-100 rounded-t-lg min-h-[4px] flex-1 flex flex-col justify-end"
                  style={{ maxHeight: "220px" }}
                >
                  <div
                    className="w-full bg-blue-600 rounded-t-lg transition-all"
                    style={{
                      height: maxVenit > 0 ? `${(d.venit / maxVenit) * 100}%` : "0",
                      minHeight: d.venit > 0 ? "8px" : "0",
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Appointments */}
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
