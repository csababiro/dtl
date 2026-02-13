"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Clock, User, History } from "lucide-react";
import { parse, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import type { DummyAppointment, DummyAppointmentType } from "@/lib/dummy-appointments";
import { APPOINTMENT_TYPE_COLORS, APPOINTMENT_TYPE_LABELS, UNCONFIRMED_COLOR } from "@/lib/appointment-constants";
import { t } from "@/lib/i18n";

type TypeFilter = "all" | DummyAppointmentType;
type StatusFilter = "all" | "confirmed" | "unconfirmed";

function getTipLabel(tip: string): string {
  return APPOINTMENT_TYPE_LABELS[tip as DummyAppointmentType] ?? tip;
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

function ApproveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 min-h-[44px]"
    >
      {pending ? "..." : t("admin.approveAppointment")}
    </button>
  );
}

interface AdminAppointmentsClientProps {
  appointments: DummyAppointment[];
  /** When using dummy data, pass a fixed "today" (e.g. "11 Feb 2025") so Viitoare/Istoric both have examples. */
  referenceToday?: string;
  /** Server action to approve (confirm) an appointment. Receives (prevState, formData); formData has "id". */
  onApprove?: (prev: unknown, formData: FormData) => Promise<{ ok: boolean }>;
}

export function AdminAppointmentsClient({
  appointments,
  referenceToday,
  onApprove,
}: AdminAppointmentsClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

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

  const filteredByType = useMemo(() => {
    const list = tab === "upcoming" ? upcoming : past;
    if (typeFilter === "all") return list;
    return list.filter((a) => a.tip === typeFilter);
  }, [tab, upcoming, past, typeFilter]);

  const filteredList = useMemo(() => {
    if (statusFilter === "all") return filteredByType;
    if (statusFilter === "confirmed") return filteredByType.filter((a) => a.status === "Confirmat");
    return filteredByType.filter((a) => a.status === "În așteptare");
  }, [filteredByType, statusFilter]);

  const { byDate, sortedDates } = useMemo(() => {
    return groupByDate(filteredList);
  }, [filteredList]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 space-y-4">
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-slate-600">Filtru tip:</span>
          {(["all", "general", "tyre", "carWash"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-colors ${
                typeFilter === f
                  ? "ring-2 ring-offset-2 ring-slate-400 bg-slate-200 text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f === "all" ? "Toate" : getTipLabel(f)}
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
          <div className="flex items-center gap-2">
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
                  .map((appt) => {
                    const isUnconfirmed = appt.status === "În așteptare";
                    const rowColor = isUnconfirmed
                      ? UNCONFIRMED_COLOR
                      : (APPOINTMENT_TYPE_COLORS[appt.tip] ?? "#64748b");
                    return (
                    <li
                      key={appt.id}
                      className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors border-l-4"
                      style={{ borderLeftColor: rowColor }}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => router.push(`/admin/appointments/${appt.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            router.push(`/admin/appointments/${appt.id}`);
                          }
                        }}
                        className="flex flex-wrap items-center gap-4 flex-1 min-w-0 cursor-pointer"
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
                        <span
                          className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: `${rowColor}20`,
                            color: rowColor,
                          }}
                        >
                          {getTipLabel(appt.tip)}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          appt.status === "Confirmat"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {appt.status === "Confirmat"
                          ? t("admin.confirmed")
                          : t("admin.pending")}
                      </span>
                      {appt.status === "În așteptare" && onApprove && (
                        <form action={(fd) => void onApprove(undefined, fd)} className="ml-auto" onClick={(e) => e.stopPropagation()}>
                          <input type="hidden" name="id" value={appt.id} />
                          <ApproveButton />
                        </form>
                      )}
                    </li>
                  );
                  })}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
