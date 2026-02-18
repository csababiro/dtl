"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  User,
  LogIn,
  History,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Settings,
  LogOut,
  Package,
  Clock,
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";
import { t } from "@/lib/i18n";
import { phoneFilter, phoneRegisterOptions, withPhoneFilter, yearFilter, validateYearRange } from "@/lib/phone-validation";
import {
  NAME_MAX,
  EMAIL_MAX,
  PHONE_MAX,
  CAR_MAKE_MODEL_MAX,
  CHASSIS_MAX,
  PASSWORD_MAX,
} from "@/lib/field-limits";
import {
  getAppointmentsForClient,
  getPlatiForClient,
  getCereriForClient,
  updateAppointmentNotesForClient,
  updatePlataNotesForClient,
  registerClient,
  getClientWithCars,
  addClientCarAction,
  deleteClientCarAction,
} from "@/app/(customer)/cont/actions";
import type { DummyAppointment } from "@/lib/dummy-appointments";
import type { ClientPlata } from "@/lib/dummy-plati";
import type { QuoteRequest } from "@/lib/quote-requests-store";
import { APPOINTMENT_TYPE_LABELS } from "@/lib/appointment-constants";

const STORAGE_KEY = "dtl_customer_session";
const NAME_STORAGE_KEY = "dtl_customer_name";
const EMAIL_STORAGE_KEY = "dtl_customer_email";
const PHONE_STORAGE_KEY = "dtl_customer_phone";
const CARS_STORAGE_KEY = "dtl_customer_cars";
const SIGNUP_PREFILL_KEY = "dtl_signup_prefill";

type Tab = "signIn" | "signUp";
type DashboardSection = "appointments" | "invoices" | "cars" | "cereri" | "settings";

type UserCar = { id: string; carMake: string; carModel: string; carYear: string; chassis?: string; photoFileName?: string };

type LoginFormValues = { email: string; password: string };
type RegisterFormValues = { name: string; email: string; phone: string; password: string; repeatPassword: string };

const inputBase = "w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all border";
const inputBasePr = "w-full p-4 pr-12 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all border";
const inputNormal = "border-slate-200";
const inputError = "border-red-500";

function ContAppointmentNotesForm({
  appointmentId,
  clientNotes,
  clientEmail,
  onSave,
  pending,
}: {
  appointmentId: string;
  clientNotes: string;
  clientEmail: string;
  onSave: () => void;
  pending: boolean;
}) {
  const [value, setValue] = useState(clientNotes);
  const [saving, setSaving] = useState(false);
  useEffect(() => setValue(clientNotes), [clientNotes]);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await updateAppointmentNotesForClient(appointmentId, value, clientEmail);
    setSaving(false);
    if (res.ok) onSave();
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
        placeholder="Adaugă notițe despre această programare..."
      />
      <button
        type="submit"
        disabled={pending || saving}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? t("common.loading") : t("common.save")}
      </button>
    </form>
  );
}

function ContFacturaNotesForm({
  plataId,
  notes,
  clientEmail,
  onSave,
  pending,
}: {
  plataId: string;
  notes: string;
  clientEmail: string;
  onSave: () => void;
  pending: boolean;
}) {
  const [value, setValue] = useState(notes);
  const [saving, setSaving] = useState(false);
  useEffect(() => setValue(notes), [notes]);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await updatePlataNotesForClient(plataId, value, clientEmail);
    setSaving(false);
    if (res.ok) onSave();
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
        placeholder="Adaugă notițe despre această factură..."
      />
      <button
        type="submit"
        disabled={pending || saving}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? t("common.loading") : t("common.save")}
      </button>
    </form>
  );
}

function formatPlataDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatCerereDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return iso;
  }
}

export function ContPageClient() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("signIn");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [promoConsent, setPromoConsent] = useState(false);
  const [registerPromo, setRegisterPromo] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterPasswordRepeat, setShowRegisterPasswordRepeat] = useState(false);
  const [dashboardSection, setDashboardSection] = useState<DashboardSection>("appointments");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userCars, setUserCars] = useState<UserCar[]>([]);
  const [showAddCarForm, setShowAddCarForm] = useState(false);
  const [newCarMake, setNewCarMake] = useState("");
  const [newCarModel, setNewCarModel] = useState("");
  const [newCarYear, setNewCarYear] = useState("");
  const [newCarChassis, setNewCarChassis] = useState("");
  const [newCarPhoto, setNewCarPhoto] = useState<File | null>(null);
  const [newCarYearError, setNewCarYearError] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [selectedCerereId, setSelectedCerereId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<DummyAppointment[]>([]);
  const [plati, setPlati] = useState<ClientPlata[]>([]);
  const [cereri, setCereri] = useState<QuoteRequest[]>([]);
  const [notesPending, setNotesPending] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [carsLoading, setCarsLoading] = useState(false);

  const loginForm = useForm<LoginFormValues>({ mode: "onChange" });
  const registerForm = useForm<RegisterFormValues>({
    mode: "onChange",
  });

  useEffect(() => {
    if (searchParams.get("tab") === "signUp") setTab("signUp");
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "true") setIsLoggedIn(true);
    const name = sessionStorage.getItem(NAME_STORAGE_KEY);
    if (name) setUserName(name);
    const storedEmail = sessionStorage.getItem(EMAIL_STORAGE_KEY);
    if (storedEmail) setEmail(storedEmail);
    const phone = sessionStorage.getItem(PHONE_STORAGE_KEY);
    if (phone) setUserPhone(phone);
    try {
      const cars = sessionStorage.getItem(CARS_STORAGE_KEY);
      if (cars) {
        const parsed = JSON.parse(cars) as (UserCar | { id: string; name: string })[];
        const normalized: UserCar[] = parsed.map((c) => {
          if ("carMake" in c) {
            const u = c as UserCar;
            return { id: u.id, carMake: u.carMake, carModel: u.carModel, carYear: u.carYear, chassis: u.chassis, photoFileName: u.photoFileName };
          }
          const leg = c as { id: string; name: string };
          return { id: leg.id, carMake: leg.name, carModel: "-", carYear: "-", chassis: undefined, photoFileName: undefined };
        });
        setUserCars(normalized);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !email?.trim()) return;
    getAppointmentsForClient(email).then(setAppointments);
    getPlatiForClient(email).then(setPlati);
    getCereriForClient(email).then(setCereri);
  }, [isLoggedIn, email]);

  useEffect(() => {
    if (!isLoggedIn || !email?.trim()) return;
    setCarsLoading(true);
    getClientWithCars(email)
      .then(({ client, cars }) => {
        if (client) {
          setClientId(client.id);
          const mapped: UserCar[] = cars.map((c) => ({
            id: c.id,
            carMake: c.carMake,
            carModel: c.carModel,
            carYear: c.carYear,
            chassis: c.chassis,
            photoFileName: undefined,
          }));
          setUserCars(mapped);
          if (typeof window !== "undefined")
            sessionStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(mapped));
        }
      })
      .finally(() => setCarsLoading(false));
  }, [isLoggedIn, email]);

  useEffect(() => {
    if (tab !== "signUp") return;
    try {
      const raw = sessionStorage.getItem(SIGNUP_PREFILL_KEY);
      if (!raw) return;
      const prefill = JSON.parse(raw) as { name?: string; email?: string; phone?: string };
      sessionStorage.removeItem(SIGNUP_PREFILL_KEY);
      if (prefill && (prefill.name || prefill.email || prefill.phone)) {
        registerForm.reset({
          name: prefill.name ?? registerForm.getValues("name") ?? "",
          email: prefill.email ?? registerForm.getValues("email") ?? "",
          phone: prefill.phone ?? registerForm.getValues("phone") ?? "",
          password: "",
          repeatPassword: "",
        });
      }
    } catch {
      // ignore
    }
  }, [tab]);

  function onLoginSubmit(data: LoginFormValues) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "true");
      sessionStorage.setItem(EMAIL_STORAGE_KEY, data.email.trim());
      const name = sessionStorage.getItem(NAME_STORAGE_KEY);
      if (name) setUserName(name);
      const phone = sessionStorage.getItem(PHONE_STORAGE_KEY);
      if (phone) setUserPhone(phone);
    }
    setEmail(data.email);
    setIsLoggedIn(true);
  }

  async function onRegisterSubmit(data: RegisterFormValues) {
    await registerClient(data.name.trim(), data.email.trim(), (data.phone ?? "").trim());
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "true");
      sessionStorage.setItem(NAME_STORAGE_KEY, data.name.trim());
      sessionStorage.setItem(EMAIL_STORAGE_KEY, data.email.trim());
      sessionStorage.setItem(PHONE_STORAGE_KEY, (data.phone || "").trim());
    }
    setUserName(data.name.trim());
    setEmail(data.email);
    setUserPhone((data.phone || "").trim());
    setIsLoggedIn(true);
  }

  function handleSaveProfile() {
    if (typeof window === "undefined") return;
    if (userName.trim()) sessionStorage.setItem(NAME_STORAGE_KEY, userName.trim());
    if (email.trim()) sessionStorage.setItem(EMAIL_STORAGE_KEY, email.trim());
    sessionStorage.setItem(PHONE_STORAGE_KEY, userPhone.trim());
  }

  async function handleAddCar() {
    const make = newCarMake.trim();
    const model = newCarModel.trim();
    const year = newCarYear.trim();
    if (year) {
      const key = validateYearRange(year);
      if (key) {
        setNewCarYearError(t("errors." + key));
        return;
      }
    }
    setNewCarYearError(null);
    if (!make && !model && !year) return;
    if (clientId) {
      const result = await addClientCarAction(clientId, {
        carMake: make || "-",
        carModel: model || "-",
        carYear: year || "-",
        chassis: newCarChassis.trim() || undefined,
      });
      if (result.ok && result.car) {
        const newCar: UserCar = {
          id: result.car.id,
          carMake: result.car.carMake,
          carModel: result.car.carModel,
          carYear: result.car.carYear,
          chassis: result.car.chassis,
          photoFileName: newCarPhoto?.name,
        };
        const next = [...userCars, newCar];
        setUserCars(next);
        if (typeof window !== "undefined")
          sessionStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(next));
      }
    } else {
      const next: UserCar[] = [
        ...userCars,
        {
          id: String(Date.now()),
          carMake: make || "-",
          carModel: model || "-",
          carYear: year || "-",
          chassis: newCarChassis.trim() || undefined,
          photoFileName: newCarPhoto?.name,
        },
      ];
      setUserCars(next);
      if (typeof window !== "undefined")
        sessionStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(next));
    }
    setNewCarMake("");
    setNewCarModel("");
    setNewCarYear("");
    setNewCarChassis("");
    setNewCarPhoto(null);
    setShowAddCarForm(false);
  }

  async function handleRemoveCar(id: string) {
    if (clientId) {
      const ok = await deleteClientCarAction(clientId, id);
      if (!ok.ok) return;
    }
    const next = userCars.filter((c) => c.id !== id);
    setUserCars(next);
    if (typeof window !== "undefined")
      sessionStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(next));
  }

  function handleLogout() {
    if (typeof window !== "undefined") sessionStorage.removeItem(STORAGE_KEY);
    setIsLoggedIn(false);
    setShowLogoutConfirm(false);
  }

  if (isLoggedIn) {
    return (
      <>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-12">
          <aside className="w-full md:w-72 shrink-0">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-6">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-black mb-4">
                  IP
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {userName || email || "Ion Popescu"}
                </h3>
                <p className="text-sm text-slate-500">
                  {t("cont.memberSince")}: Ianuarie 2024
                </p>
              </div>
              <nav className="space-y-1">
                {(
                  [
                    { id: "appointments" as const, name: t("cont.appointmentHistory"), icon: History },
                    { id: "invoices" as const, name: t("cont.invoices"), icon: CreditCard },
                    { id: "cereri" as const, name: t("cont.cereri"), icon: FileText },
                    { id: "cars" as const, name: t("cont.myCars"), icon: Package },
                    { id: "settings" as const, name: t("cont.accountSettings"), icon: Settings },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDashboardSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                      dashboardSection === item.id
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all mt-4"
                >
                  <LogOut size={20} />
                  <span>{t("cont.logout")}</span>
                </button>
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {dashboardSection === "appointments" && (
              <section className="space-y-6">
                {selectedAppointmentId ? (
                  (() => {
                    const appt = appointments.find((x) => x.id === selectedAppointmentId);
                    if (!appt) return null;
                    const typeLabel = APPOINTMENT_TYPE_LABELS[appt.tip] ?? appt.tip;
                    const statusLabel = appt.status === "Confirmat" ? t("cont.completed") : t("cont.requested");
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedAppointmentId(null)}
                          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm"
                        >
                          <ChevronLeft size={20} />
                          {t("common.back")}
                        </button>
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                          <h2 className="text-2xl font-black text-slate-900">{typeLabel}</h2>
                          <dl className="grid gap-4 text-sm">
                            <div>
                              <dt className="text-slate-500 font-medium mb-0.5">Data</dt>
                              <dd className="text-slate-900">{appt.data}</dd>
                            </div>
                            <div>
                              <dt className="text-slate-500 font-medium mb-0.5">Ora</dt>
                              <dd className="text-slate-900">{appt.ora}</dd>
                            </div>
                            <div>
                              <dt className="text-slate-500 font-medium mb-0.5">Status</dt>
                              <dd className="text-slate-900">{statusLabel}</dd>
                            </div>
                            {appt.descriere && (
                              <div>
                                <dt className="text-slate-500 font-medium mb-0.5">Descriere serviciu</dt>
                                <dd className="text-slate-900">{appt.descriere}</dd>
                              </div>
                            )}
                            <div>
                              <dt className="text-slate-500 font-medium mb-0.5">Notițe</dt>
                              <dd className="text-slate-900">
                                <ContAppointmentNotesForm
                                  appointmentId={appt.id}
                                  clientNotes={appt.clientNotes ?? ""}
                                  clientEmail={email}
                                  onSave={() => {
                                    setNotesPending(true);
                                    getAppointmentsForClient(email).then((list) => {
                                      setAppointments(list);
                                      setNotesPending(false);
                                    });
                                  }}
                                  pending={notesPending}
                                />
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <>
                    <h2 className="text-2xl font-black text-slate-900">
                      {t("cont.appointmentHistory")}
                    </h2>
                    <div className="space-y-4">
                      {appointments.length === 0 ? (
                        <p className="text-slate-500">{t("cont.noAppointments")}</p>
                      ) : (
                        appointments.map((appt) => {
                          const typeLabel = APPOINTMENT_TYPE_LABELS[appt.tip] ?? appt.tip;
                          const statusLabel = appt.status === "Confirmat" ? t("cont.completed") : t("cont.requested");
                          const color = appt.status === "Confirmat" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700";
                          return (
                            <button
                              key={appt.id}
                              type="button"
                              onClick={() => setSelectedAppointmentId(appt.id)}
                              className="w-full text-left bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-blue-200 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                                  <Clock size={24} />
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900">{typeLabel}</h4>
                                  <p className="text-sm text-slate-500">
                                    {appt.data} • {appt.ora}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${color}`}>
                                  {statusLabel}
                                </span>
                                <ChevronRight size={24} className="text-slate-400 shrink-0" />
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </>
                )}
              </section>
            )}

            {dashboardSection === "invoices" && (
              <section className="space-y-6">
                {selectedInvoiceId ? (
                  (() => {
                    const plata = plati.find((p) => p.id === selectedInvoiceId);
                    if (!plata) return null;
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedInvoiceId(null)}
                          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm"
                        >
                          <ChevronLeft size={20} />
                          {t("common.back")}
                        </button>
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                          <h2 className="text-2xl font-black text-slate-900">
                            Factura {plata.nrFactura} · {formatPlataDate(plata.data)}
                          </h2>
                          <dl className="grid gap-4 text-sm">
                            <div>
                              <dt className="text-slate-500 font-medium mb-0.5">Data</dt>
                              <dd className="text-slate-900">{formatPlataDate(plata.data)}</dd>
                            </div>
                            <div>
                              <dt className="text-slate-500 font-medium mb-0.5">Sumă</dt>
                              <dd className="text-slate-900 font-bold">{plata.suma}</dd>
                            </div>
                            <div>
                              <dt className="text-slate-500 font-medium mb-0.5">Descriere</dt>
                              <dd className="text-slate-900">{plata.descriere}</dd>
                            </div>
                            <div>
                              <dt className="text-slate-500 font-medium mb-0.5">Notițe</dt>
                              <dd className="text-slate-900">
                                <ContFacturaNotesForm
                                  plataId={plata.id}
                                  notes={plata.notes ?? ""}
                                  clientEmail={email}
                                  onSave={() => {
                                    setNotesPending(true);
                                    getPlatiForClient(email).then((list) => {
                                      setPlati(list);
                                      setNotesPending(false);
                                    });
                                  }}
                                  pending={notesPending}
                                />
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <>
                    <h2 className="text-2xl font-black text-slate-900">
                      {t("cont.invoices")}
                    </h2>
                    {/* Mobile: cards */}
                    <div className="md:hidden space-y-3">
                      {plati.length === 0 ? (
                        <p className="py-8 text-slate-500 text-center">{t("cont.noInvoices")}</p>
                      ) : (
                        plati.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setSelectedInvoiceId(f.id)}
                            className="w-full text-left bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-3 mb-1">
                              <span className="font-bold text-slate-900">Factura {f.nrFactura}</span>
                              <span className="font-black text-blue-600">{f.suma}</span>
                            </div>
                            <p className="text-sm text-slate-500">{formatPlataDate(f.data)}</p>
                            {f.descriere ? (
                              <p className="text-sm text-slate-700 mt-1 line-clamp-2">{f.descriere}</p>
                            ) : null}
                          </button>
                        ))
                      )}
                    </div>
                    {/* Desktop: table (line representation) */}
                    <div className="hidden md:block bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                      <table className="w-full text-left min-w-[320px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="px-4 sm:px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                              Nr. Factură
                            </th>
                            <th className="px-4 sm:px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                              Dată
                            </th>
                            <th className="px-4 sm:px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                              Sumă
                            </th>
                            <th className="px-4 sm:px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                              Descriere
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {plati.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-4 sm:px-6 py-8 text-slate-500 text-center">
                                {t("cont.noInvoices")}
                              </td>
                            </tr>
                          ) : (
                            plati.map((f) => (
                              <tr
                                key={f.id}
                                onClick={() => setSelectedInvoiceId(f.id)}
                                className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                              >
                                <td className="px-4 sm:px-6 py-4 font-semibold text-slate-700">{f.nrFactura}</td>
                                <td className="px-4 sm:px-6 py-4 text-slate-500">{formatPlataDate(f.data)}</td>
                                <td className="px-4 sm:px-6 py-4 text-right font-black text-blue-600">
                                  {f.suma}
                                </td>
                                <td className="px-4 sm:px-6 py-4 text-slate-700">{f.descriere}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </section>
            )}

            {dashboardSection === "cereri" && (
              <section className="space-y-6">
                {selectedCerereId ? (
                  (() => {
                    const cerere = cereri.find((c) => c.id === selectedCerereId);
                    if (!cerere) return null;
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedCerereId(null)}
                          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm"
                        >
                          <ChevronLeft size={20} />
                          {t("common.back")}
                        </button>
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                          <h2 className="text-2xl font-black text-slate-900">
                            {t("cont.cerereOferta")} · {formatCerereDate(cerere.createdAt)}
                          </h2>
                          <dl className="grid gap-4 text-sm">
                            <div>
                              <dt className="text-slate-500 font-medium mb-0.5">Data cerere</dt>
                              <dd className="text-slate-900">{formatCerereDate(cerere.createdAt)}</dd>
                            </div>
                            <div>
                              <dt className="text-slate-500 font-medium mb-0.5">Mașină</dt>
                              <dd className="text-slate-900">{cerere.carMake} {cerere.carModel} ({cerere.carYear})</dd>
                            </div>
                            <div>
                              <dt className="text-slate-500 font-medium mb-0.5">Status</dt>
                              <dd className="text-slate-900">{(cerere.status ?? "pending") === "prepared" ? t("cont.cerereStatusPrepared") : t("cont.cerereStatusPending")}</dd>
                            </div>
                            <div className="sm:col-span-2">
                              <dt className="text-slate-500 font-medium mb-0.5">Descriere</dt>
                              <dd className="text-slate-900">{cerere.description}</dd>
                            </div>
                          </dl>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <>
                    <h2 className="text-2xl font-black text-slate-900">
                      {t("cont.cereri")}
                    </h2>
                    <div className="space-y-4">
                      {cereri.length === 0 ? (
                        <p className="text-slate-500">{t("cont.noCereri")}</p>
                      ) : (
                        cereri.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedCerereId(c.id)}
                            className="w-full text-left bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-blue-200 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                                <FileText size={24} />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900">{c.carMake} {c.carModel}</h4>
                                <p className="text-sm text-slate-500">
                                  {formatCerereDate(c.createdAt)} · {(c.status ?? "pending") === "prepared" ? t("cont.cerereStatusPrepared") : t("cont.cerereStatusPending")}
                                </p>
                              </div>
                            </div>
                            <ChevronRight size={24} className="text-slate-400 shrink-0" />
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </section>
            )}

            {dashboardSection === "cars" && (
              <section className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900">
                  {t("cont.myCars")}
                </h2>
                {carsLoading && (
                  <p className="text-slate-500">{t("common.loading")}</p>
                )}
                {!carsLoading && userCars.length > 0 && (
                  <div className="space-y-3">
                    {userCars.map((car) => (
                      <div
                        key={car.id}
                        className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4"
                      >
                        <div className="font-medium text-slate-900">
                          <div>{[car.carMake, car.carModel, car.carYear].filter((x) => x && x !== "-").join(" • ") || car.carMake}</div>
                          {car.chassis ? <div className="text-sm text-slate-500 mt-0.5">{t("cont.chassis")}: {car.chassis}</div> : null}
                          {car.photoFileName ? <div className="text-sm text-slate-500">{t("cont.photoOptional")}: {car.photoFileName}</div> : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCar(car.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-bold"
                        >
                          {t("common.delete")}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {showAddCarForm ? (
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-sm text-slate-500 mb-4">
                      {t("programare.carDetails")}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700">
                          {t("programare.carMake")}
                        </label>
                        <input
                          type="text"
                          value={newCarMake}
                          onChange={(e) => setNewCarMake(e.target.value.slice(0, CAR_MAKE_MODEL_MAX))}
                          placeholder="Ex: BMW"
                          maxLength={CAR_MAKE_MODEL_MAX}
                          className={`${inputBase} ${inputNormal}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700">
                          {t("programare.carModel")}
                        </label>
                        <input
                          type="text"
                          value={newCarModel}
                          onChange={(e) => setNewCarModel(e.target.value.slice(0, CAR_MAKE_MODEL_MAX))}
                          placeholder="Ex: Seria 3"
                          maxLength={CAR_MAKE_MODEL_MAX}
                          className={`${inputBase} ${inputNormal}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700">
                          {t("programare.carYear")}
                        </label>
                        <input
                          type="text"
                          value={newCarYear}
                          onChange={(e) => {
                            setNewCarYear(yearFilter(e.target.value));
                            setNewCarYearError(null);
                          }}
                          placeholder="Ex: 2020"
                          className={`${inputBase} ${newCarYearError ? "border-red-500" : inputNormal}`}
                        />
                        {newCarYearError && (
                          <p className="text-xs text-red-500 mt-1">{newCarYearError}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <label className="block text-sm font-bold text-slate-700">
                        {t("cont.chassis")}
                      </label>
                      <input
                        type="text"
                        value={newCarChassis}
                        onChange={(e) => setNewCarChassis(e.target.value.slice(0, CHASSIS_MAX))}
                        placeholder="WBAxxxxxxxxxxxxxx"
                        maxLength={CHASSIS_MAX}
                        className={`${inputBase} ${inputNormal}`}
                      />
                    </div>
                    <div className="space-y-2 mb-4">
                      <label className="block text-sm font-bold text-slate-700">
                        {t("cont.photoOptional")}
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setNewCarPhoto(e.target.files?.[0] ?? null)}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-700"
                      />
                      {newCarPhoto ? <span className="text-xs text-slate-500">{newCarPhoto.name}</span> : null}
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleAddCar}
                        disabled={!newCarMake.trim() && !newCarModel.trim() && !newCarYear.trim()}
                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {t("common.save")}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowAddCarForm(false); setNewCarMake(""); setNewCarModel(""); setNewCarYear(""); setNewCarChassis(""); setNewCarPhoto(null); setNewCarYearError(null); }}
                        className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                      >
                        {t("common.cancel")}
                      </button>
                    </div>
                  </div>
                ) : !carsLoading ? (
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    {userCars.length === 0 && (
                      <>
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                            <Package size={32} />
                          </div>
                          <p className="text-slate-600 font-medium mb-2">
                            {t("cont.noCars")}
                          </p>
                          <p className="text-sm text-slate-500 max-w-sm mb-6">
                            {t("cont.addCarHint")}
                          </p>
                        </div>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowAddCarForm(true)}
                      className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      {t("cont.addCar")}
                    </button>
                  </div>
                ) : null}
              </section>
            )}

            {dashboardSection === "settings" && (
              <section className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900">
                  {t("cont.accountSettings")}
                </h2>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="max-w-md space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        {t("programare.name")}
                      </label>
                      <input
                        type="text"
                        value={userName || ""}
                        onChange={(e) => setUserName(e.target.value.slice(0, NAME_MAX))}
                        placeholder="Ion Popescu"
                        maxLength={NAME_MAX}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        {t("admin.email")}
                      </label>
                      <input
                        type="email"
                        value={email || ""}
                        onChange={(e) => setEmail(e.target.value.slice(0, EMAIL_MAX))}
                        placeholder="ion@exemplu.ro"
                        maxLength={EMAIL_MAX}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        {t("programare.phone")}
                      </label>
                      <input
                        type="tel"
                        value={userPhone || ""}
                        onChange={(e) => setUserPhone(phoneFilter(e.target.value).slice(0, PHONE_MAX))}
                        placeholder="07xx xxx xxx"
                        maxLength={PHONE_MAX}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      {t("common.save")}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" aria-modal="true" role="dialog">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <p className="text-slate-800 font-bold mb-6">{t("cont.logoutConfirm")}</p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                {t("cont.logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
    );
  }

  const benefits = [
    t("cont.benefitRepairs"),
    t("cont.benefitBooking"),
    t("cont.benefitPromo"),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col md:flex-row items-center gap-16">
      <div className="flex-1">
        <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight">
          {t("cont.title")}
        </h1>
        <p className="text-xl text-slate-500 mb-10 leading-relaxed">
          {t("cont.encourageAccount")}
        </p>
        <div className="space-y-6 mb-10">
          {benefits.map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle className="text-blue-600 shrink-0" size={20} />
              <span className="text-slate-700 font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md bg-white p-10 rounded-3xl border border-slate-100 shadow-xl">
        <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl mb-10">
          <button
            type="button"
            onClick={() => setTab("signIn")}
            className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold transition-all ${
              tab === "signIn"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t("cont.signIn")}
          </button>
          <button
            type="button"
            onClick={() => setTab("signUp")}
            className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold transition-all ${
              tab === "signUp"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t("cont.signUp")}
          </button>
        </div>

        {tab === "signIn" ? (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("admin.email")}
              </label>
              <input
                type="text"
                inputMode="email"
                autoComplete="email"
                {...loginForm.register("email", {
                required: t("cont.requiredEmail"),
                validate: (v) =>
                  !v || v.includes("@") ? true : t("errors.emailIncludeAt"),
              })}
                placeholder="ion@exemplu.ro"
                maxLength={EMAIL_MAX}
                className={`${inputBase} ${loginForm.formState.errors.email ? inputError : inputNormal}`}
              />
              {loginForm.formState.errors.email && (
                <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex justify-between items-center">
                <span>{t("admin.password")}</span>
                <button
                  type="button"
                  className="text-blue-600 text-xs hover:underline"
                >
                  {t("cont.forgotPassword")}
                </button>
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  {...loginForm.register("password", { required: t("cont.requiredPassword") })}
                  placeholder="••••••••"
                  maxLength={PASSWORD_MAX}
                  className={`${inputBasePr} ${loginForm.formState.errors.password ? inputError : inputNormal}`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={showLoginPassword ? "Ascunde parola" : "Arată parola"}
                >
                  {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={promoConsent}
                onChange={(e) => setPromoConsent(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                {t("cont.promoConsent")}
              </span>
            </label>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {t("cont.loginCta")} <LogIn size={20} />
            </button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.name")}
              </label>
              <input
                type="text"
                {...registerForm.register("name", { required: t("cont.requiredName") })}
                placeholder="Ion Popescu"
                maxLength={NAME_MAX}
                className={`${inputBase} ${registerForm.formState.errors.name ? inputError : inputNormal}`}
              />
              {registerForm.formState.errors.name && (
                <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("admin.email")}
              </label>
              <input
                type="text"
                inputMode="email"
                autoComplete="email"
                {...registerForm.register("email", {
                  required: t("cont.requiredEmail"),
                  validate: (v) =>
                    !v || v.includes("@") ? true : t("errors.emailIncludeAt"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("cereOferta.invalidEmail"),
                  },
                })}
                placeholder="ion@exemplu.ro"
                maxLength={EMAIL_MAX}
                className={`${inputBase} ${registerForm.formState.errors.email ? inputError : inputNormal}`}
              />
              {registerForm.formState.errors.email && (
                <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.phone")}
              </label>
              <input
                type="tel"
                placeholder="07xx xxx xxx"
                maxLength={PHONE_MAX}
                className={`${inputBase} ${registerForm.formState.errors.phone ? inputError : inputNormal}`}
                {...withPhoneFilter(
                  registerForm.register("phone", phoneRegisterOptions(t("programare.requiredPhone"), t("errors.phoneDigitsOnly")))
                )}
              />
              {registerForm.formState.errors.phone && (
                <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("admin.password")}
              </label>
              <div className="relative">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  {...registerForm.register("password", { required: t("cont.requiredPassword") })}
                  placeholder="••••••••"
                  maxLength={PASSWORD_MAX}
                  className={`${inputBasePr} ${registerForm.formState.errors.password ? inputError : inputNormal}`}
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={showRegisterPassword ? "Ascunde parola" : "Arată parola"}
                >
                  {showRegisterPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {registerForm.formState.errors.password && (
                <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cont.repeatPassword")}
              </label>
              <div className="relative">
                <input
                  type={showRegisterPasswordRepeat ? "text" : "password"}
                  {...registerForm.register("repeatPassword", {
                    required: t("cont.requiredPassword"),
                    validate: (v) => v === registerForm.watch("password") ? true : t("cont.passwordMismatch"),
                  })}
                  placeholder="••••••••"
                  maxLength={PASSWORD_MAX}
                  className={`${inputBasePr} ${registerForm.formState.errors.repeatPassword ? inputError : inputNormal}`}
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPasswordRepeat((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={showRegisterPasswordRepeat ? "Ascunde parola" : "Arată parola"}
                >
                  {showRegisterPasswordRepeat ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {registerForm.formState.errors.repeatPassword && (
                <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.repeatPassword.message}</p>
              )}
            </div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={registerPromo}
                onChange={(e) => setRegisterPromo(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                {t("cont.promoConsent")}
              </span>
            </label>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {t("cont.signUp")} <User size={20} />
            </button>
          </form>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm">{t("cont.noAccountYet")}</p>
          <button
            type="button"
            onClick={() => setTab(tab === "signIn" ? "signUp" : "signIn")}
            className="mt-2 font-bold text-blue-600 hover:underline"
          >
            {t("cont.registerNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
