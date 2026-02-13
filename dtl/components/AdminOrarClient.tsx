"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { useWorkingHours } from "@/lib/hooks/useWorkingHours";
import type { DaySchedule } from "@/lib/working-hours";
import { t } from "@/lib/i18n";

const DAY_KEYS = [
  "admin.dayMon",
  "admin.dayTue",
  "admin.dayWed",
  "admin.dayThu",
  "admin.dayFri",
  "admin.daySat",
] as const;

/** 24h time options every 30 min (06:00 – 22:00) for orar dropdowns */
const TIME_OPTIONS_24H = (() => {
  const opts: string[] = [];
  for (let h = 6; h <= 22; h++) {
    opts.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 22) opts.push(`${String(h).padStart(2, "0")}:30`);
  }
  return opts;
})();

function isClosed(d: DaySchedule): d is { closed: true } {
  return "closed" in d && d.closed === true;
}

export function AdminOrarClient() {
  const { schedule, setSchedule, loading, error, save } = useWorkingHours();
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await save(schedule);
    if ("error" in result) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const setDay = (index: number, daySchedule: DaySchedule) => {
    setSchedule((prev) => ({
      ...prev,
      days: prev.days.map((d, i) => (i === index ? daySchedule : d)) as typeof prev.days,
    }));
  };

  return (
    <div className="md:bg-white md:rounded-3xl md:border md:border-slate-100 md:shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
          <Clock size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t("admin.orar")}</h2>
          <p className="text-sm text-slate-500">
            {t("admin.orarDescription")}
          </p>
        </div>
      </div>
      {error && (
        <p className="px-4 md:px-6 pt-4 text-sm text-red-600">{error.message}</p>
      )}
      <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
        <div className="space-y-4">
          {DAY_KEYS.map((labelKey, index) => {
            const day = schedule.days[index];
            const closed = isClosed(day);
            const start = closed ? "08:00" : day.start;
            const end = closed ? "17:00" : day.end;
            return (
              <div
                key={labelKey}
                className="md:flex md:flex-wrap md:items-center md:gap-4 md:py-3 md:border-b md:border-slate-100 md:last:border-0 rounded-xl border border-slate-200 md:border-0 p-4 md:p-0 space-y-4 md:space-y-0"
              >
                <div className="w-full md:w-28 shrink-0 font-medium text-slate-700">
                  {t(labelKey)}
                </div>
                <label className="flex items-center gap-2 shrink-0">
                  <input
                    type="checkbox"
                    checked={closed}
                    onChange={(e) =>
                      setDay(index, e.target.checked ? { closed: true } : { start: "08:00", end: "17:00" })
                    }
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">
                    {t("admin.orarClosed")}
                  </span>
                </label>
                {!closed && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:contents">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-slate-500 w-24 shrink-0">
                        {t("admin.workingHoursStart")}
                      </label>
                      <div className="grid grid-cols-[auto_1rem] items-stretch">
                        <select
                          value={start}
                          onChange={(e) =>
                            setDay(index, { ...day, start: e.target.value, end })
                          }
                          className="min-w-0 px-3 py-2 pr-7 rounded-l-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[44px] border-r-0 rounded-r-none"
                        >
                          {TIME_OPTIONS_24H.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <span className="rounded-r-lg border border-slate-200 border-l-0 bg-slate-50" aria-hidden />
                      </div>
                    </div>
                    <span className="text-slate-400 hidden sm:inline md:inline">–</span>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-slate-500 w-24 shrink-0">
                        {t("admin.workingHoursEnd")}
                      </label>
                      <div className="grid grid-cols-[auto_1rem] items-stretch">
                        <select
                          value={end}
                          onChange={(e) =>
                            setDay(index, { ...day, start, end: e.target.value })
                          }
                          className="min-w-0 px-3 py-2 pr-7 rounded-l-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[44px] border-r-0 rounded-r-none"
                        >
                          {TIME_OPTIONS_24H.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <span className="rounded-r-lg border border-slate-200 border-l-0 bg-slate-50" aria-hidden />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("common.save")}
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-600">Salvat.</span>
          )}
        </div>
      </form>
    </div>
  );
}
