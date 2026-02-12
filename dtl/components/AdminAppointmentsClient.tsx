"use client";

import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, Clock, User, History } from "lucide-react";
import { parse, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import type { DummyAppointment } from "@/lib/dummy-appointments";
import { t } from "@/lib/i18n";

const TIP_LABELS: Record<string, string> = {
  general: "Service general",
  tyre: "Anvelope",
  carWash: "Spălătorie",
};

function getTipLabel(tip: string): string {
  return TIP_LABELS[tip] ?? tip;
}

function parseAppointmentDate(data: string): Date {
  return parse(data, "d MMM yyyy", new Date(), { locale: enUS });
}

function groupByDate(appointments: DummyAppointment[]) {
  const byDate: Record<string, DummyAppointment[]> = {};
  for (const appt of appointments) {
    const key = appt.data;
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(appt);
  }
  const sortedDates = Object.keys(byDate).sort(
    (a, b) => parseAppointmentDate(a).getTime() - parseAppointmentDate(b).getTime()
  );
  return { byDate, sortedDates };
}

type Tab = "upcoming" | "history";

interface AdminAppointmentsClientProps {
  appointments: DummyAppointment[];
  /** When using dummy data, pass a fixed "today" (e.g. "11 Feb 2025") so Viitoare/Istoric both have examples. */
  referenceToday?: string;
}

export function AdminAppointmentsClient({
  appointments,
  referenceToday,
}: AdminAppointmentsClientProps) {
  const [tab, setTab] = useState<Tab>("upcoming");

  const todayStart = useMemo(
    () =>
      referenceToday
        ? startOfDay(parse(referenceToday, "d MMM yyyy", new Date(), { locale: enUS }))
        : startOfDay(new Date()),
    [referenceToday]
  );

  const { upcoming, past } = useMemo(() => {
    const up: DummyAppointment[] = [];
    const pa: DummyAppointment[] = [];
    for (const appt of appointments) {
      const d = parseAppointmentDate(appt.data);
      if (d >= todayStart) up.push(appt);
      else pa.push(appt);
    }
    return { upcoming: up, past: pa };
  }, [appointments, todayStart]);

  const { byDate, sortedDates } = useMemo(() => {
    const list = tab === "upcoming" ? upcoming : past;
    return groupByDate(list);
  }, [tab, upcoming, past]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <CalendarIcon size={24} />
            </div>
            <span className="font-bold text-slate-800">Programări pe dată</span>
          </div>
          <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
            <button
              type="button"
              onClick={() => setTab("upcoming")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
                tab === "upcoming"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <CalendarIcon size={18} />
              Viitoare ({upcoming.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("history")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
                tab === "history"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <History size={18} />
              Istoric ({past.length})
            </button>
          </div>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {sortedDates.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            {tab === "upcoming"
              ? "Nicio programare viitoare."
              : "Nicio programare în istoric."}
          </p>
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
  );
}
