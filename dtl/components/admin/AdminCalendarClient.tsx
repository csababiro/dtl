"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addHours } from "date-fns";
import { enUS } from "date-fns/locale";
import { useRouter } from "next/navigation";
import type { DummyAppointment, DummyAppointmentType } from "@/lib/dummy-appointments";
import { APPOINTMENT_TYPE_COLORS, UNCONFIRMED_COLOR } from "@/lib/appointment-constants";
import type { WorkingHoursSchedule } from "@/lib/working-hours";
import { getMinMaxForDay, DEFAULT_SCHEDULE } from "@/lib/working-hours";
import { getAppointments } from "@/lib/api/appointments";
import { getWorkingHours } from "@/lib/api/settings";
import { t } from "@/lib/i18n";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "ro-RO": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TYPE_LABELS: Record<DummyAppointmentType, string> = {
  general: "Service general",
  tyre: "Anvelope",
  carWash: "Spălătorie",
};

export type CalendarFilter = "all" | DummyAppointmentType;
export type StatusFilter = "all" | "confirmed" | "unconfirmed";

export interface CalendarEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
  tip: DummyAppointmentType;
  resource?: { nume: string; marca: string; model: string; status: string };
}

function appointmentsToEvents(appointments: DummyAppointment[]): CalendarEvent[] {
  return appointments.map((appt) => {
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

interface AdminCalendarClientProps {
  appointments?: DummyAppointment[];
  workingHoursSchedule?: WorkingHoursSchedule;
}

export function AdminCalendarClient({
  appointments: appointmentsProp,
  workingHoursSchedule: workingHoursScheduleProp,
}: AdminCalendarClientProps) {
  const router = useRouter();
  const [appointments, setAppointments] = useState<DummyAppointment[]>(appointmentsProp ?? []);
  const [workingHoursSchedule, setWorkingHoursSchedule] = useState<WorkingHoursSchedule | undefined>(workingHoursScheduleProp);
  const [loading, setLoading] = useState(!appointmentsProp || !workingHoursScheduleProp);

  useEffect(() => {
    if (appointmentsProp != null && workingHoursScheduleProp != null) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    Promise.all([getAppointments(), getWorkingHours()]).then(([appRes, hoursRes]) => {
      if (cancelled) return;
      setAppointments("data" in appRes ? appRes.data : []);
      setWorkingHoursSchedule("data" in hoursRes ? hoursRes.data : DEFAULT_SCHEDULE);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [appointmentsProp, workingHoursScheduleProp]);

  const [filter, setFilter] = useState<CalendarFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [view, setView] = useState<View>("day");
  const [date, setDate] = useState(() => new Date());
  const schedule = workingHoursSchedule ?? DEFAULT_SCHEDULE;
  const allEvents = useMemo(
    () => appointmentsToEvents(appointments),
    [appointments]
  );
  const events = useMemo(() => {
    let list = allEvents;
    if (filter !== "all") {
      list = list.filter((e) => e.tip === filter);
    }
    if (statusFilter === "confirmed") {
      list = list.filter((e) => e.resource?.status === "Confirmat");
    } else if (statusFilter === "unconfirmed") {
      list = list.filter((e) => e.resource?.status === "În așteptare");
    }
    return list;
  }, [allEvents, filter, statusFilter]);

  const eventStyleGetter = (event: CalendarEvent) => {
    const isUnconfirmed = event.resource?.status === "În așteptare";
    const color = isUnconfirmed
      ? UNCONFIRMED_COLOR
      : APPOINTMENT_TYPE_COLORS[event.tip];
    return {
      style: {
        backgroundColor: color,
        borderLeft: `4px solid ${color}`,
      },
    };
  };

  const { min, max } = useMemo(
    () => getMinMaxForDay(date, schedule),
    [date, schedule]
  );

  if (loading) {
    return <p className="text-slate-500 py-4">{t("common.loading")}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
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
              style={{ backgroundColor: APPOINTMENT_TYPE_COLORS.general }}
            />
            General
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: APPOINTMENT_TYPE_COLORS.tyre }}
            />
            Anvelope
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: APPOINTMENT_TYPE_COLORS.carWash }}
            />
            Spălătorie
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: UNCONFIRMED_COLOR }}
            />
            Neconfirmat
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-bold text-slate-600">Status:</span>
          <div className="flex rounded-xl bg-slate-100 p-1 gap-0.5">
            {(
              [
                { value: "all" as const, label: "Toate" },
                { value: "confirmed" as const, label: "Confirmate" },
                { value: "unconfirmed" as const, label: "Neconfirmate" },
              ] as const
            ).map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                  statusFilter === value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[500px] min-h-0 rounded-2xl border border-slate-200 overflow-auto bg-white [&_.rbc-calendar]:min-h-[480px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          culture="ro-RO"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          defaultDate={new Date(2025, 1, 1)}
          views={["day", "month", "week"]}
          min={min}
          max={max}
          popup
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => router.push(`/admin/appointments/${event.id}`)}
          formats={{
            timeGutterFormat: (date: Date) => format(date, "HH:mm"),
            eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
              `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`,
            agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
              `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`,
          }}
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
