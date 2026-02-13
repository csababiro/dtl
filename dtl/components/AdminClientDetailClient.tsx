"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Car, Calendar, Wrench, CreditCard } from "lucide-react";
import type { DummyClient } from "@/lib/dummy-clients";
import type { DummyAppointment } from "@/lib/dummy-appointments";
import type { ClientPlata } from "@/lib/dummy-plati";
import { APPOINTMENT_TYPE_LABELS } from "@/lib/appointment-constants";

function formatDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function formatDateOnly(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getTipLabel(tip: string): string {
  return APPOINTMENT_TYPE_LABELS[tip as keyof typeof APPOINTMENT_TYPE_LABELS] ?? tip;
}

interface AdminClientDetailClientProps {
  client: DummyClient;
  appointments: DummyAppointment[];
  plati: ClientPlata[];
}

export function AdminClientDetailClient({ client, appointments, plati }: AdminClientDetailClientProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <User size={28} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{client.name}</h2>
              <p className="text-sm text-slate-500">
                {client.programariCount} {client.programariCount === 1 ? "programare" : "programări"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 text-slate-600 sm:col-span-2">
              <Phone size={20} className="text-slate-400 shrink-0" />
              <a href={`tel:${client.phone.replace(/\s/g, "")}`} className="hover:text-blue-600">
                {client.phone}
              </a>
            </div>
            <div className="flex items-center gap-3 text-slate-600 sm:col-span-2">
              <Mail size={20} className="text-slate-400 shrink-0" />
              <a href={`mailto:${client.email}`} className="hover:text-blue-600">
                {client.email}
              </a>
            </div>
            <div className="flex items-center gap-3 text-slate-600 sm:col-span-2">
              <Car size={20} className="text-slate-400 shrink-0" />
              <span>{client.car ?? "—"}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 sm:col-span-2">
              <Calendar size={20} className="text-slate-400 shrink-0" />
              <span>Ultima vizită: {formatDate(client.lastVisit)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
            <Link
              href={`tel:${client.phone.replace(/\s/g, "")}`}
              className="text-blue-600 hover:underline text-sm font-medium shrink-0 whitespace-nowrap"
            >
              Sună
            </Link>
            <Link
              href={`sms:${client.phone.replace(/\s/g, "")}`}
              className="text-blue-600 hover:underline text-sm font-medium shrink-0 whitespace-nowrap"
            >
              SMS
            </Link>
            <Link
              href={`https://wa.me/${client.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm font-medium shrink-0 whitespace-nowrap"
            >
              WhatsApp
            </Link>
          </div>
        </div>
      </div>

      {/* Servicii / Programări */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <Wrench size={24} className="text-slate-500" />
          <h3 className="text-lg font-bold text-slate-900">Servicii / Programări</h3>
        </div>
        <div className="p-6">
          {appointments.length === 0 ? (
            <p className="text-slate-500 text-sm">Nicio programare înregistrată.</p>
          ) : (
            <ul className="space-y-3">
              {appointments.map((appt) => (
                <li
                  key={appt.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/admin/appointments/${appt.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/admin/appointments/${appt.id}`);
                    }
                  }}
                  className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors"
                >
                  <span className="text-slate-500 text-sm font-mono">{appt.data} · {appt.ora}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                    {getTipLabel(appt.tip)}
                  </span>
                  <span className="text-slate-700">{appt.descriere ?? appt.marca + " " + appt.model}</span>
                  <span className={`text-xs font-bold uppercase ml-auto ${appt.status === "Confirmat" ? "text-green-600" : "text-amber-600"}`}>
                    {appt.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Plăți */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <CreditCard size={24} className="text-slate-500" />
          <h3 className="text-lg font-bold text-slate-900">Plăți</h3>
        </div>
        <div className="p-6">
          {plati.length === 0 ? (
            <p className="text-slate-500 text-sm">Nicio plată înregistrată.</p>
          ) : (
            <ul className="space-y-3">
              {plati.map((plata) => (
                <li
                  key={plata.id}
                  className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-slate-100"
                >
                  <span className="text-slate-500 text-sm">{formatDateOnly(plata.data)}</span>
                  <span className="font-bold text-slate-900">{plata.suma}</span>
                  <span className="text-slate-700">{plata.descriere}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
