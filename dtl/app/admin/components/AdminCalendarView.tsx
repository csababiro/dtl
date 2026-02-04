"use client";

import { useState } from "react";

type CalendarType = "general" | "tyre" | "carWash";
type ViewMode = "day" | "week" | "month";

/**
 * Staff calendar: separate calendars (General, Tyre, Car Wash),
 * Day/Week/Month views. Technician: only assigned jobs + "Mark job done".
 */
const CALENDAR_LABELS: Record<CalendarType, string> = {
  general: "Service general",
  tyre: "Anvelope",
  carWash: "Spălătorie",
};

const MOCK_JOBS = [
  { id: "1", type: "general" as CalendarType, customer: "Client A", status: "pending", date: "2025-02-05", time: "10:00" },
  { id: "2", type: "tyre" as CalendarType, customer: "Client B", status: "confirmed", date: "2025-02-05", time: "14:00" },
  { id: "3", type: "carWash" as CalendarType, customer: "Client C", status: "pending", date: "2025-02-06", time: "09:00" },
];

export function AdminCalendarView() {
  const [calendarType, setCalendarType] = useState<CalendarType>("general");
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [jobs, setJobs] = useState(MOCK_JOBS);

  const markDone = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const filteredJobs = jobs.filter((j) => j.type === calendarType);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Calendar</label>
          <select
            value={calendarType}
            onChange={(e) => setCalendarType(e.target.value as CalendarType)}
            className="mt-1 rounded border border-zinc-300 px-3 py-2"
          >
            {(Object.keys(CALENDAR_LABELS) as CalendarType[]).map((key) => (
              <option key={key} value={key}>
                {CALENDAR_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Vizualizare</label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
            className="mt-1 rounded border border-zinc-300 px-3 py-2"
          >
            <option value="day">Zi</option>
            <option value="week">Săptămână (implicit)</option>
            <option value="month">Lună</option>
          </select>
        </div>
      </div>
      <p className="mt-4 text-sm text-zinc-500">
        Grid calendar (zi/săptămână/lună) și formular dată/oră vor fi completate cu API-ul. Technician vede doar joburile asignate și poate marca „Finalizat”.
      </p>
      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-medium">
          Joburi – {CALENDAR_LABELS[calendarType]} ({viewMode})
        </h2>
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between rounded border border-zinc-200 bg-white px-4 py-3 shadow-sm"
          >
            <div>
              <span className="font-medium">{job.customer}</span>
              <span className="ml-2 text-sm text-zinc-500">
                {job.date} {job.time} – {job.status}
              </span>
            </div>
            <button
              type="button"
              onClick={() => markDone(job.id)}
              className="rounded bg-zinc-900 px-3 py-1 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Marchează finalizat
            </button>
          </div>
        ))}
        {filteredJobs.length === 0 && (
          <p className="text-sm text-zinc-500">Niciun job în acest calendar.</p>
        )}
      </div>
    </div>
  );
}
