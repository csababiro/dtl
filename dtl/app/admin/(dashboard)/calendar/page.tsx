import { t } from "@/lib/i18n";
import { DUMMY_APPOINTMENTS } from "@/lib/dummy-appointments";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import Link from "next/link";

const TIP_LABELS: Record<string, string> = {
  general: "Service general",
  tyre: "Anvelope",
  carWash: "Spălătorie",
};

function getTipLabel(tip: string): string {
  return TIP_LABELS[tip] ?? tip;
}

export default function AdminCalendarPage() {
  const byDate = DUMMY_APPOINTMENTS.reduce<Record<string, typeof DUMMY_APPOINTMENTS>>(
    (acc, appt) => {
      const key = appt.data;
      if (!acc[key]) acc[key] = [];
      acc[key].push(appt);
      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(byDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {t("admin.calendar")}
          </h1>
          <p className="text-slate-500 mt-1">
            Programări pe zile (date dummy, fără API).
          </p>
        </div>
        <Link
          href="/admin/appointments"
          className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 w-fit"
        >
          Listă programări
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
            <CalendarIcon size={24} />
          </div>
          <span className="font-bold text-slate-800">Programări pe dată</span>
        </div>
        <div className="divide-y divide-slate-100">
          {sortedDates.length === 0 ? (
            <p className="p-8 text-center text-slate-500">{t("admin.noAppointments")}</p>
          ) : (
            sortedDates.map((dateStr) => (
              <div key={dateStr} className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CalendarIcon size={20} className="text-blue-600" />
                  {dateStr}
                </h3>
                <ul className="space-y-3">
                  {byDate[dateStr]
                    .sort((a, b) => a.ora.localeCompare(b.ora))
                    .map((appt) => (
                      <li
                        key={appt.id}
                        className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                      >
                        <span className="flex items-center gap-2 text-slate-500 font-mono text-sm">
                          <Clock size={16} />
                          {appt.ora}
                        </span>
                        <span className="flex items-center gap-2 font-bold text-slate-900">
                          <User size={16} className="text-slate-400" />
                          {appt.nume}
                        </span>
                        <span className="text-slate-600">
                          {appt.marca} {appt.model}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {getTipLabel(appt.tip)}
                        </span>
                        <span
                          className={`ml-auto px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            appt.status === "Confirmat"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {appt.status === "Confirmat"
                            ? t("admin.confirmed")
                            : t("admin.pending")}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
