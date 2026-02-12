"use client";

import { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addHours } from "date-fns";
import { enUS } from "date-fns/locale";
import { DUMMY_APPOINTMENTS } from "@/lib/dummy-appointments";
import type { DummyAppointmentType } from "@/lib/dummy-appointments";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "ro-RO": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TYPE_COLORS: Record<DummyAppointmentType, string> = {
  general: "#2563eb",
  tyre: "#d97706",
  carWash: "#0d9488",
};

const TYPE_LABELS: Record<DummyAppointmentType, string> = {
  general: "Service general",
  tyre: "Anvelope",
  carWash: "Spălătorie",
};

export type CalendarFilter = "all" | DummyAppointmentType;

export interface CalendarEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
  tip: DummyAppointmentType;
  resource?: { nume: string; marca: string; model: string; status: string };
}

function dummyToEvents(): CalendarEvent[] {
  return DUMMY_APPOINTMENTS.map((appt) => {
    const start = parse(
      `${appt.data} ${appt.ora}`,
      "d MMM yyyy HH:mm",
      new Date(),
      { locale: enUS }
    );
    const end = addHours(start, 1);
    return {
      id: appt.id,
      start,
      end,
      title: `${appt.nume} – ${appt.marca} ${appt.model}`,
      tip: appt.tip,
      resource: {
        nume: appt.nume,
        marca: appt.marca,
        model: appt.model,
        status: appt.status,
      },
    };
  });
}

export function AdminCalendarClient() {
  const [filter, setFilter] = useState<CalendarFilter>("all");
  const allEvents = useMemo(() => dummyToEvents(), []);
  const events = useMemo(
    () =>
      filter === "all"
        ? allEvents
        : allEvents.filter((e) => e.tip === filter),
    [allEvents, filter]
  );

  const eventStyleGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: TYPE_COLORS[event.tip],
      borderLeft: `4px solid ${TYPE_COLORS[event.tip]}`,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-slate-600">Filtru tip:</span>
        {(["all", "general", "tyre", "carWash"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-colors ${
              filter === f
                ? "ring-2 ring-offset-2 ring-slate-400 bg-slate-200 text-slate-900"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f === "all" ? "Toate" : TYPE_LABELS[f]}
          </button>
        ))}
        <span className="flex items-center gap-2 ml-2 text-xs text-slate-400">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: TYPE_COLORS.general }}
          />
          General
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: TYPE_COLORS.tyre }}
          />
          Anvelope
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: TYPE_COLORS.carWash }}
          />
          Spălătorie
        </span>
      </div>
      <div className="h-[500px] min-h-0 rounded-2xl border border-slate-200 overflow-auto bg-white [&_.rbc-calendar]:min-h-[480px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          culture="ro-RO"
          defaultView="month"
          defaultDate={new Date(2025, 1, 1)}
          views={["month", "week", "day"]}
          popup
          eventPropGetter={eventStyleGetter}
          messages={{
            date: "Dată",
            time: "Oră",
            event: "Programare",
            allDay: "Toată ziua",
            week: "Săptămână",
            work_week: "Săpt. lucrătoare",
            day: "Zi",
            month: "Lună",
            previous: "Anterior",
            next: "Următor",
            today: "Azi",
            noEventsInRange: "Nu există programări în acest interval.",
          }}
          className="rbc-calendar-admin"
        />
      </div>
    </div>
  );
}
