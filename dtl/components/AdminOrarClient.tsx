"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import {
  getWorkingHoursSchedule,
  setWorkingHoursSchedule,
} from "@/lib/working-hours";
import type { WorkingHoursSchedule, DaySchedule } from "@/lib/working-hours";
import { t } from "@/lib/i18n";

const DAY_KEYS = [
  "admin.dayMon",
  "admin.dayTue",
  "admin.dayWed",
  "admin.dayThu",
  "admin.dayFri",
  "admin.daySat",
] as const;

function isClosed(d: DaySchedule): d is { closed: true } {
  return "closed" in d && d.closed === true;
}

export function AdminOrarClient() {
  const [schedule, setSchedule] = useState<WorkingHoursSchedule>(() =>
    getWorkingHoursSchedule()
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSchedule(getWorkingHoursSchedule());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkingHoursSchedule(schedule);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const setDay = (index: number, daySchedule: DaySchedule) => {
    setSchedule((prev) => ({
      ...prev,
      days: prev.days.map((d, i) => (i === index ? daySchedule : d)) as WorkingHoursSchedule["days"],
    }));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
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
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-4">
          {DAY_KEYS.map((labelKey, index) => {
            const day = schedule.days[index];
            const closed = isClosed(day);
            const start = closed ? "08:00" : day.start;
            const end = closed ? "17:00" : day.end;
            return (
              <div
                key={labelKey}
                className="flex flex-wrap items-center gap-4 py-3 border-b border-slate-100 last:border-0"
              >
                <div className="w-28 shrink-0 font-medium text-slate-700">
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
                  <>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-slate-500 sr-only">
                        {t("admin.workingHoursStart")}
                      </label>
                      <input
                        type="time"
                        value={start}
                        onChange={(e) =>
                          setDay(index, { ...day, start: e.target.value, end })
                        }
                        className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <span className="text-slate-400">–</span>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-slate-500 sr-only">
                        {t("admin.workingHoursEnd")}
                      </label>
                      <input
                        type="time"
                        value={end}
                        onChange={(e) =>
                          setDay(index, { ...day, start, end: e.target.value })
                        }
                        className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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
