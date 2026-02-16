"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parse, format } from "date-fns";
import { enUS } from "date-fns/locale";
import type { DummyAppointment } from "@/lib/dummy-appointments";
import { t } from "@/lib/i18n";
import { APPOINTMENT_TYPE_LABELS, APPOINTMENT_TYPE_COLORS } from "@/lib/appointment-constants";
import { User, Phone, Mail, Calendar, Clock, Car } from "lucide-react";
import { patch, del } from "@/lib/api-client";

function getTipLabel(tip: string): string {
  return APPOINTMENT_TYPE_LABELS[tip as keyof typeof APPOINTMENT_TYPE_LABELS] ?? tip;
}

/** Parse "12 Feb 2025" -> "2025-02-12" for date input */
function toDateInputValue(data: string): string {
  try {
    const d = parse(data, "d MMM yyyy", new Date(), { locale: enUS });
    return format(d, "yyyy-MM-dd");
  } catch {
    return "";
  }
}

interface AdminAppointmentDetailClientProps {
  appointment: DummyAppointment;
  /** @deprecated Use API; kept for type compatibility. */
  onUpdateTime?: (prev: unknown, formData: FormData) => Promise<{ ok: boolean }>;
  /** @deprecated Use API; kept for type compatibility. */
  onDelete?: (prev: unknown, formData: FormData) => Promise<{ ok: boolean }>;
  /** @deprecated Use API; kept for type compatibility. */
  onApprove?: (prev: unknown, formData: FormData) => Promise<{ ok: boolean }>;
  /** When set, notes form is shown and uses API to save. */
  onUpdateNotes?: (formData: FormData) => Promise<{ ok: boolean }>;
  /** When set (e.g. from client detail page), redirect after delete goes to client. */
  returnToClientId?: string;
}

function HiddenReturnToClient({ returnToClientId }: { returnToClientId?: string }) {
  if (!returnToClientId) return null;
  return <input type="hidden" name="returnToClientId" value={returnToClientId} />;
}

export function AdminAppointmentDetailClient({
  appointment,
  onUpdateTime: _onUpdateTime,
  onDelete: _onDelete,
  onApprove: _onApprove,
  onUpdateNotes,
  returnToClientId,
}: AdminAppointmentDetailClientProps) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const typeColor = APPOINTMENT_TYPE_COLORS[appointment.tip] ?? "#64748b";

  const handleApprove = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending("approve");
    const res = await patch<DummyAppointment>(`/appointments/${appointment.id}`, { status: "Confirmat" });
    setPending(null);
    if ("error" in res) {
      if (res.error.status === 401) router.push("/admin/login");
      return;
    }
    router.refresh();
  };

  const handleUpdateTime = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = (form.querySelector('[name="data"]') as HTMLInputElement)?.value?.trim();
    const ora = (form.querySelector('[name="ora"]') as HTMLInputElement)?.value?.trim();
    if (!data || !ora) return;
    setPending("time");
    const res = await patch<DummyAppointment>(`/appointments/${appointment.id}`, { data, ora });
    setPending(null);
    if ("error" in res) {
      if (res.error.status === 401) router.push("/admin/login");
      return;
    }
    router.refresh();
  };

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined" && !window.confirm("Sigur ștergi această programare?")) return;
    setPending("delete");
    const res = await del<void>(`/appointments/${appointment.id}`);
    setPending(null);
    if ("error" in res) {
      if (res.error.status === 401) router.push("/admin/login");
      return;
    }
    if (returnToClientId) router.push(`/admin/clients/${returnToClientId}`);
    else router.push("/admin/appointments");
  };

  const handleUpdateNotes = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const descriere = (form.querySelector('[name="descriere"]') as HTMLTextAreaElement)?.value?.trim();
    const clientNotes = (form.querySelector('[name="clientNotes"]') as HTMLTextAreaElement)?.value?.trim();
    setPending("notes");
    const res = await patch<DummyAppointment>(`/appointments/${appointment.id}`, { descriere, clientNotes });
    setPending(null);
    if ("error" in res) {
      if (res.error.status === 401) router.push("/admin/login");
      return;
    }
    router.refresh();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div
        className="h-2 w-full"
        style={{ backgroundColor: typeColor }}
      />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 text-slate-700">
            <User size={20} className="text-slate-400" />
            <span className="font-bold text-slate-900">{appointment.nume}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Phone size={20} className="text-slate-400" />
            <a href={`tel:${appointment.telefon}`} className="hover:text-blue-600">
              {appointment.telefon}
            </a>
          </div>
          <div className="flex items-center gap-3 text-slate-600 sm:col-span-2">
            <Mail size={20} className="text-slate-400" />
            <a href={`mailto:${appointment.email}`} className="hover:text-blue-600">
              {appointment.email}
            </a>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Car size={20} className="text-slate-400" />
            <span>
              {appointment.marca} {appointment.model}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold uppercase"
              style={{
                backgroundColor: `${typeColor}20`,
                color: typeColor,
              }}
            >
              {getTipLabel(appointment.tip)}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                appointment.status === "Confirmat"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {appointment.status === "Confirmat"
                ? t("admin.confirmed")
                : t("admin.pending")}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdateNotes} className="space-y-4 border-t border-slate-100 pt-6">
            <input type="hidden" name="id" value={appointment.id} />
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                Descriere (serviciu)
              </label>
              <textarea
                name="descriere"
                rows={2}
                defaultValue={appointment.descriere ?? ""}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                placeholder="Ex: Revizie, Schimb anvelope"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                Notițe client / istoric
              </label>
              <textarea
                name="clientNotes"
                rows={3}
                defaultValue={appointment.clientNotes ?? ""}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                placeholder="Notițe editabile de client și admin"
              />
            </div>
            <button
              type="submit"
              disabled={pending === "notes"}
              className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-bold hover:bg-slate-800 disabled:opacity-50"
            >
              {pending === "notes" ? "..." : "Salvează descriere / notițe"}
            </button>
          </form>

        <div className="border-t border-slate-100 pt-6">
          <p className="text-sm font-bold text-slate-600 mb-3">
            Modifică data și ora
          </p>
          <form onSubmit={handleUpdateTime} className="flex flex-wrap items-end gap-4">
            <input type="hidden" name="id" value={appointment.id} />
            <HiddenReturnToClient returnToClientId={returnToClientId} />
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-slate-400" />
              <input
                type="date"
                name="data"
                defaultValue={toDateInputValue(appointment.data)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-slate-400" />
              <input
                type="time"
                name="ora"
                defaultValue={appointment.ora}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!!pending}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {pending === "time" ? "..." : t("admin.editTime")}
            </button>
          </form>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
          {appointment.status === "În așteptare" && (
            <form onSubmit={handleApprove}>
              <button
                type="submit"
                disabled={!!pending}
                className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 disabled:opacity-50"
              >
                {pending === "approve" ? "..." : t("admin.approveAppointment")}
              </button>
            </form>
          )}
          <form onSubmit={handleDelete}>
            <button
              type="submit"
              disabled={!!pending}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-50"
            >
              {pending === "delete" ? "..." : t("admin.removeAppointment")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
