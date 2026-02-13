"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { User, Phone, Mail, Car, Calendar, Wrench, CreditCard, Plus, Pencil, Trash2 } from "lucide-react";
import type { DummyClient } from "@/lib/dummy-clients";
import type { DummyAppointment } from "@/lib/dummy-appointments";
import type { ClientPlata } from "@/lib/dummy-plati";
import type { ClientCar } from "@/lib/client-cars-store";
import { APPOINTMENT_TYPE_LABELS } from "@/lib/appointment-constants";
import { addCarAction, updateCarAction, deleteCarAction } from "@/app/admin/(dashboard)/clients/[id]/actions";
import {
  updateAppointmentTime,
  deleteAppointmentAction,
  approveAppointment,
  updateAppointmentNotesAction,
} from "@/app/admin/(dashboard)/appointments/actions";
import { AdminAppointmentDetailClient } from "./AdminAppointmentDetailClient";
import { X } from "lucide-react";

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
  cars: ClientCar[];
}

export function AdminClientDetailClient({ client, appointments, plati, cars: initialCars }: AdminClientDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cars, setCars] = useState(initialCars);
  const [showAddCar, setShowAddCar] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({ carMake: "", carModel: "", carYear: "", chassis: "" });
  const [editForm, setEditForm] = useState({ carMake: "", carModel: "", carYear: "", chassis: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const refreshCars = () => {
    startTransition(() => router.refresh());
  };

  useEffect(() => {
    setCars(initialCars);
  }, [initialCars]);

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const res = await addCarAction(client.id, new FormData(e.target as HTMLFormElement));
    if (res.ok) {
      setAddForm({ carMake: "", carModel: "", carYear: "", chassis: "" });
      setShowAddCar(false);
      refreshCars();
    } else {
      setFormError(res.error ?? "Eroare la adăugare.");
    }
  };

  const handleUpdateCar = async (e: React.FormEvent, carId: string) => {
    e.preventDefault();
    setFormError(null);
    const res = await updateCarAction(carId, new FormData(e.target as HTMLFormElement));
    if (res.ok) {
      setEditingCarId(null);
      refreshCars();
    } else {
      setFormError(res.error ?? "Eroare la actualizare.");
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (!confirm("Ștergi această mașină?")) return;
    setFormError(null);
    const res = await deleteCarAction(carId);
    if (res.ok) refreshCars();
    else setFormError(res.error ?? "Eroare la ștergere.");
  };

  const startEdit = (car: ClientCar) => {
    setEditingCarId(car.id);
    setEditForm({
      carMake: car.carMake,
      carModel: car.carModel,
      carYear: car.carYear,
      chassis: car.chassis ?? "",
    });
    setFormError(null);
  };

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

      {/* Mașini */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Car size={24} className="text-slate-500" />
            <h3 className="text-lg font-bold text-slate-900">Mașini</h3>
          </div>
          {!showAddCar && (
            <button
              type="button"
              onClick={() => { setShowAddCar(true); setFormError(null); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
              disabled={isPending}
            >
              <Plus size={18} />
              Adaugă mașină
            </button>
          )}
        </div>
        <div className="p-6">
          {formError && (
            <p className="text-red-600 text-sm mb-4">{formError}</p>
          )}
          {cars.length === 0 && !showAddCar && (
            <p className="text-slate-500 text-sm">Nicio mașină înregistrată.</p>
          )}
          <ul className="space-y-3">
            {cars.map((car) => (
              <li
                key={car.id}
                className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/30"
              >
                {editingCarId === car.id ? (
                  <form
                    onSubmit={(e) => handleUpdateCar(e, car.id)}
                    className="flex flex-wrap items-end gap-3 w-full"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 min-w-0">
                      <div>
                        <label className="block text-xs font-medium text-slate-500">Marca</label>
                        <input
                          type="text"
                          value={editForm.carMake}
                          onChange={(e) => setEditForm((f) => ({ ...f, carMake: e.target.value }))}
                          name="carMake"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500">Model</label>
                        <input
                          type="text"
                          value={editForm.carModel}
                          onChange={(e) => setEditForm((f) => ({ ...f, carModel: e.target.value }))}
                          name="carModel"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500">An</label>
                        <input
                          type="text"
                          value={editForm.carYear}
                          onChange={(e) => setEditForm((f) => ({ ...f, carYear: e.target.value }))}
                          name="carYear"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500">Șasiu (opțional)</label>
                        <input
                          type="text"
                          value={editForm.chassis}
                          onChange={(e) => setEditForm((f) => ({ ...f, chassis: e.target.value }))}
                          name="chassis"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isPending}
                        className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                      >
                        Salvează
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingCarId(null); setFormError(null); }}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium"
                      >
                        Anulare
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <span className="font-medium text-slate-900">
                      {car.carMake} {car.carModel} {car.carYear !== "" ? `(${car.carYear})` : ""}
                    </span>
                    {car.chassis && (
                      <span className="text-sm text-slate-500">Șasiu: {car.chassis}</span>
                    )}
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(car)}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        title="Editează"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCar(car.id)}
                        disabled={isPending}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                        title="Șterge"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
          {showAddCar && (
            <form
              onSubmit={handleAddCar}
              className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50"
            >
              <p className="text-sm font-medium text-slate-700 mb-3">Mașină nouă</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500">Marca *</label>
                  <input
                    type="text"
                    name="carMake"
                    value={addForm.carMake}
                    onChange={(e) => setAddForm((f) => ({ ...f, carMake: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">Model *</label>
                  <input
                    type="text"
                    name="carModel"
                    value={addForm.carModel}
                    onChange={(e) => setAddForm((f) => ({ ...f, carModel: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">An *</label>
                  <input
                    type="text"
                    name="carYear"
                    value={addForm.carYear}
                    onChange={(e) => setAddForm((f) => ({ ...f, carYear: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">Șasiu (opțional)</label>
                  <input
                    type="text"
                    name="chassis"
                    value={addForm.chassis}
                    onChange={(e) => setAddForm((f) => ({ ...f, chassis: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  Adaugă
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddCar(false); setFormError(null); setAddForm({ carMake: "", carModel: "", carYear: "", chassis: "" }); }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium"
                >
                  Anulare
                </button>
              </div>
            </form>
          )}
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
                  onClick={() => setSelectedAppointmentId(appt.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedAppointmentId(appt.id);
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

      {/* Modal: programare detail (open here instead of navigating to programări) */}
      {selectedAppointmentId && (() => {
        const appt = appointments.find((a) => a.id === selectedAppointmentId);
        if (!appt) return null;
        return (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedAppointmentId(null);
                router.refresh();
              }
            }}
          >
            <div
              className="relative bg-white rounded-3xl shadow-xl max-w-2xl w-full my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 flex items-center justify-between p-4 border-b border-slate-100 bg-white rounded-t-3xl z-10">
                <h3 className="text-lg font-bold text-slate-900">Detalii programare</h3>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAppointmentId(null);
                    router.refresh();
                  }}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Închide"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
                <AdminAppointmentDetailClient
                  appointment={appt}
                  onUpdateTime={updateAppointmentTime}
                  onDelete={deleteAppointmentAction}
                  onApprove={approveAppointment}
                  onUpdateNotes={updateAppointmentNotesAction}
                  returnToClientId={client.id}
                />
              </div>
            </div>
          </div>
        );
      })()}

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
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/admin/clients/${client.id}/facturi/${plata.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/admin/clients/${client.id}/facturi/${plata.id}`);
                    }
                  }}
                  className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors"
                >
                  <span className="text-slate-500 text-sm">{formatDateOnly(plata.data)}</span>
                  <span className="font-bold text-slate-900">{plata.suma}</span>
                  <span className="text-slate-700">{plata.descriere}</span>
                  {plata.notes && (
                    <span className="text-xs text-slate-400 truncate max-w-[120px]" title={plata.notes}>
                      {plata.notes}
                    </span>
                  )}
                  <span className="text-blue-600 text-sm font-medium ml-auto">Detalii</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
