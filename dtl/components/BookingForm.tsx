"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Calendar as CalendarIcon,
  Car,
  User,
  Mail,
  Phone,
  CheckCircle2,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { t } from "@/lib/i18n";
import { phoneRegisterOptions, withPhoneFilter, withYearFilter, YEAR_PATTERN, validateYearRange } from "@/lib/phone-validation";
import {
  NAME_MAX,
  EMAIL_MAX,
  PHONE_MAX,
  CAR_MAKE_MODEL_MAX,
  DESCRIPTION_MAX,
} from "@/lib/field-limits";
import { CreateAccountPromptModal } from "@/components/CreateAccountPromptModal";
import { notifyOnBookingSuccess } from "@/lib/push-notify";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00",
];

const OPTIONAL_SERVICES_GENERAL = [
  "Schimb ulei", "Revizie", "Frâne", "Filtre", "Direcție",
  "Diagnostic motor", "Baterie", "Climatizare", "Rotație anvelope",
];

const OPTIONAL_SERVICES_TYRE = [
  "Montaj anvelope", "Echilibrare", "Reparare pană", "Schimb valve",
];

const OPTIONAL_SERVICES_WASH = [
  "Spălare exterior", "Spălare interior", "Detaliu exterior", "Detaliu complet",
];

function getOptionalServices(type: string): string[] {
  if (type === "tyre") return OPTIONAL_SERVICES_TYRE;
  if (type === "carWash") return OPTIONAL_SERVICES_WASH;
  return OPTIONAL_SERVICES_GENERAL;
}

function getDateMin(): string {
  return new Date().toISOString().split("T")[0];
}

function getDateMax(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

export interface BookingTab {
  id: string;
  label: string;
}

interface BookingFormProps {
  tabs: BookingTab[];
  /** Initial tab when opening from a link (e.g. ?tab=tyre). Must match a tab id. */
  defaultTab?: string;
}

type BookingFormValues = {
  name: string;
  phone: string;
  email: string;
  carMake: string;
  carModel: string;
  carYear: string;
  description: string;
  date: string;
  time: string;
};

const inputBase = "w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all border";
const inputBasePl = "w-full p-4 pl-12 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all border";
const inputNormal = "border-slate-200";
const inputError = "border-red-500";

const CUSTOMER_NAME_KEY = "dtl_customer_name";
const CUSTOMER_EMAIL_KEY = "dtl_customer_email";
const CUSTOMER_PHONE_KEY = "dtl_customer_phone";
const CUSTOMER_SESSION_KEY = "dtl_customer_session";
const CARS_STORAGE_KEY = "dtl_customer_cars";

export function BookingForm({ tabs, defaultTab }: BookingFormProps) {
  const initialTab =
    defaultTab && tabs.some((t) => t.id === defaultTab)
      ? defaultTab
      : tabs[0]?.id ?? "general";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [optionalServices, setOptionalServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCreateAccountPrompt, setShowCreateAccountPrompt] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    getValues,
    formState: { errors },
  } = useForm<BookingFormValues>({ mode: "onChange" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(CUSTOMER_SESSION_KEY) !== "true") return;
    const name = sessionStorage.getItem(CUSTOMER_NAME_KEY) ?? "";
    const email = sessionStorage.getItem(CUSTOMER_EMAIL_KEY) ?? "";
    const phone = sessionStorage.getItem(CUSTOMER_PHONE_KEY) ?? "";
    let carMake = "";
    let carModel = "";
    let carYear = "";
    try {
      const cars = sessionStorage.getItem(CARS_STORAGE_KEY);
      if (cars) {
        const arr = JSON.parse(cars) as { carMake?: string; carModel?: string; carYear?: string }[];
        const first = arr[0];
        if (first) {
          carMake = first.carMake ?? "";
          carModel = first.carModel ?? "";
          carYear = first.carYear ?? "";
        }
      }
    } catch {
      // ignore
    }
    if (name || email || phone || carMake || carModel || carYear) {
      reset({
        name,
        email,
        phone,
        carMake: carMake || getValues("carMake") || "",
        carModel: carModel || getValues("carModel") || "",
        carYear: carYear || getValues("carYear") || "",
        description: getValues("description") || "",
        date: getValues("date") || "",
        time: getValues("time") || "",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount to prepopulate from session
  }, []);

  const optionalList = getOptionalServices(activeTab);

  function toggleOptionalService(item: string) {
    setOptionalServices((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  }

  const onSubmit = (data: BookingFormValues) => {
    setLoading(true);
    setSuccess(true);
    setShowCreateAccountPrompt(true);
    setLoading(false);
    notifyOnBookingSuccess({ name: data.name, date: data.date, time: data.time });
  };

  if (success) {
    return (
      <>
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl text-center border border-green-100">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              Cerere trimisă!
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              {t("programare.successMessage")}
            </p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Fă o altă programare
            </button>
          </div>
        </div>
        <CreateAccountPromptModal
          open={showCreateAccountPrompt}
          onClose={() => setShowCreateAccountPrompt(false)}
          source="booking"
          email={getValues("email")}
          name={getValues("name")}
          phone={getValues("phone")}
        />
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
          {t("programare.title")}
        </h1>
        <p className="text-slate-500">
          Rapid, simplu și eficient. Alege serviciul și intervalul dorit.
        </p>
      </div>

      {tabs.length > 0 && (
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Car size={20} className="text-blue-600" /> {t("programare.carDetails")}
          </h3>
          {activeTab === "tyre" || activeTab === "carWash" ? (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.car")} *
              </label>
              <input
                type="text"
                {...register("carMake", { required: t("programare.requiredCar") })}
                placeholder="Ex: Dacia Sandero"
                maxLength={CAR_MAKE_MODEL_MAX}
                className={`${inputBase} ${errors.carMake ? inputError : inputNormal}`}
              />
              {errors.carMake && (
                <p className="text-xs text-red-500 mt-1">{errors.carMake.message}</p>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    {t("programare.carMake")} *
                  </label>
                  <input
                    type="text"
                    {...register("carMake", { required: t("programare.requiredCarMake") })}
                    placeholder="Ex: BMW"
                    maxLength={CAR_MAKE_MODEL_MAX}
                    className={`${inputBase} ${errors.carMake ? inputError : inputNormal}`}
                  />
                  {errors.carMake && (
                    <p className="text-xs text-red-500 mt-1">{errors.carMake.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    {t("programare.carModel")} *
                  </label>
                  <input
                    type="text"
                    {...register("carModel", { required: t("programare.requiredCarModel") })}
                    placeholder="Ex: Seria 3"
                    maxLength={CAR_MAKE_MODEL_MAX}
                    className={`${inputBase} ${errors.carModel ? inputError : inputNormal}`}
                  />
                  {errors.carModel && (
                    <p className="text-xs text-red-500 mt-1">{errors.carModel.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    {t("programare.carYear")} *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 2020"
                    className={`${inputBase} ${errors.carYear ? inputError : inputNormal}`}
                    {...withYearFilter(
                      register("carYear", {
                        required: t("programare.requiredCarYear"),
                        pattern: { value: YEAR_PATTERN, message: t("errors.carYearDigitsOnly") },
                        validate: (v) => {
                          const key = validateYearRange(v);
                          return key ? t("errors." + key) : true;
                        },
                      })
                    )}
                  />
                  {errors.carYear && (
                    <p className="text-xs text-red-500 mt-1">{errors.carYear.message}</p>
                  )}
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  {t("programare.carProblem")} *
                </label>
                <textarea
                  {...register("description", { required: t("programare.requiredDescription") })}
                  rows={3}
                  maxLength={DESCRIPTION_MAX}
                  placeholder={t("programare.carProblemPlaceholder")}
                  className={`${inputBase} resize-none ${errors.description ? inputError : inputNormal}`}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>
            </>
          )}
          {optionalList.length > 0 && (
            <div className="mt-6 space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {activeTab === "tyre" || activeTab === "carWash" ? t("programare.services") : t("programare.optionalServices")}
              </label>
              <div className="flex flex-wrap gap-3">
                {optionalList.map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={optionalServices.includes(item)}
                      onChange={() => toggleOptionalService(item)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CalendarIcon size={20} className="text-blue-600" /> {t("programare.selectDate")} / {t("programare.selectTime")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.selectDate")} *
              </label>
              <input
                type="date"
                {...register("date", { required: t("programare.requiredDate") })}
                min={getDateMin()}
                max={getDateMax()}
                className={`${inputBase} ${errors.date ? inputError : inputNormal}`}
              />
              {errors.date && (
                <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">
                {t("programare.bookingWindow")}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.selectTime")} *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <label key={slot} className="relative group cursor-pointer">
                    <input
                      type="radio"
                      value={slot}
                      {...register("time", { required: t("programare.requiredTime") })}
                      className="peer absolute opacity-0"
                    />
                    <div className="p-3 text-center border rounded-lg text-sm font-bold text-slate-600 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 group-hover:border-blue-300 transition-all border-slate-200">
                      {slot}
                    </div>
                  </label>
                ))}
              </div>
              {errors.time && (
                <p className="text-xs text-red-500 mt-1">{errors.time.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <User size={20} className="text-blue-600" /> {t("programare.customerDetails")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.name")} *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  {...register("name", { required: t("programare.requiredName") })}
                  placeholder="Ion Popescu"
                  maxLength={NAME_MAX}
                  className={`${inputBasePl} ${errors.name ? inputError : inputNormal}`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.phone")} *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="tel"
                  placeholder="07xx xxx xxx"
                  maxLength={PHONE_MAX}
                  className={`${inputBasePl} ${errors.phone ? inputError : inputNormal}`}
                  {...withPhoneFilter(
                    register("phone", phoneRegisterOptions(t("programare.requiredPhone"), t("errors.phoneDigitsOnly")))
                  )}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.email")} *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  {...register("email", {
                    required: t("programare.requiredEmail"),
                    validate: (v) =>
                      !v || v.includes("@") ? true : t("errors.emailIncludeAt"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("cereOferta.invalidEmail"),
                    },
                  })}
                  placeholder="ion.popescu@exemplu.ro"
                  maxLength={EMAIL_MAX}
                  className={`${inputBasePl} ${errors.email ? inputError : inputNormal}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              {t("programare.submitRequest")} <ChevronRight size={24} />
            </>
          )}
        </button>

        <p className="text-center text-sm text-slate-400">
          Prin trimiterea acestui formular, ești de acord cu prelucrarea datelor
          tale cu caracter personal.
        </p>
      </form>
    </div>
  );
}
