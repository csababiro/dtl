"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { getWorkingHours, setWorkingHours } from "@/lib/working-hours";
import type { WorkingHoursRange } from "@/lib/working-hours";
import { t } from "@/lib/i18n";

export function AdminOrarClient() {
  const [range, setRange] = useState<WorkingHoursRange>({ start: "08:00", end: "17:00" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setRange(getWorkingHours());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkingHours(range);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
          <Clock size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t("admin.orar")}</h2>
          <p className="text-sm text-slate-500">{t("admin.orarDescription")}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin.workingHoursStart")}
            </label>
            <input
              type="time"
              value={range.start}
              onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin.workingHoursEnd")}
            </label>
            <input
              type="time"
              value={range.end}
              onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
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
