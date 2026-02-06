"use client";

import { useState } from "react";
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
import { post } from "@/lib/api-client";
import { ErrorToast } from "./ErrorToast";

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const OPTIONAL_SERVICES_GENERAL = [
  "Schimb ulei",
  "Revizie",
  "Frâne",
  "Filtre",
  "Direcție",
  "Diagnostic motor",
  "Baterie",
  "Climatizare",
  "Rotație anvelope",
];

const OPTIONAL_SERVICES_TYRE = [
  "Montaj anvelope",
  "Echilibrare",
  "Reparare pană",
  "Schimb valve",
];

const OPTIONAL_SERVICES_WASH = [
  "Spălare exterior",
  "Spălare interior",
  "Detaliu exterior",
  "Detaliu complet",
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
}

export function BookingForm({ tabs }: BookingFormProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "general");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [optionalServices, setOptionalServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const optionalList = getOptionalServices(activeTab);

  function toggleOptionalService(item: string) {
    setOptionalServices((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const p = phone.trim();
    const em = email.trim();
    const make = carMake.trim();
    const model = carModel.trim();
    const year = carYear.trim();
    const desc = description.trim();
    if (!n || !p || !em || !make || !model || !year || !desc || !date || !time) {
      setErrorMessage(t("errors.validation"));
      return;
    }
    setErrorMessage(null);
    setLoading(true);
    const result = await post<unknown>("/appointment-requests", {
      name: n,
      phone: p,
      email: em,
      carMake: make,
      carModel: model,
      carYear: year,
      description: desc,
      date,
      time,
      bookingType: activeTab,
      optionalServices: optionalServices.length > 0 ? optionalServices : undefined,
    });
    setLoading(false);
    if ("error" in result) {
      setErrorMessage(result.error.message || t("errors.network"));
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {errorMessage ? (
          <ErrorToast
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />
        ) : null}

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Car size={20} className="text-blue-600" />{" "}
            {t("programare.carDetails")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.carMake")} *
              </label>
              <input
                type="text"
                value={carMake}
                onChange={(e) => setCarMake(e.target.value)}
                placeholder="Ex: BMW"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.carModel")} *
              </label>
              <input
                type="text"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                placeholder="Ex: Seria 3"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.carYear")} *
              </label>
              <input
                type="text"
                value={carYear}
                onChange={(e) => setCarYear(e.target.value)}
                placeholder="Ex: 2020"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <label className="text-sm font-bold text-slate-700">
              {t("programare.carProblem")} *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={t("programare.carProblemPlaceholder")}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              required
            />
          </div>
          {optionalList.length > 0 && (
            <div className="mt-6 space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.optionalServices")}
              </label>
              <div className="flex flex-wrap gap-3">
                {optionalList.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 cursor-pointer"
                  >
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
            <CalendarIcon size={20} className="text-blue-600" />{" "}
            {t("programare.selectDate")} / {t("programare.selectTime")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.selectDate")} *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getDateMin()}
                max={getDateMax()}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
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
                      name="time"
                      value={slot}
                      checked={time === slot}
                      onChange={() => setTime(slot)}
                      className="peer absolute opacity-0"
                    />
                    <div className="p-3 text-center border border-slate-200 rounded-lg text-sm font-bold text-slate-600 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 group-hover:border-blue-300 transition-all">
                      {slot}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <User size={20} className="text-blue-600" />{" "}
            {t("programare.customerDetails")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.name")} *
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ion Popescu"
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.phone")} *
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07xx xxx xxx"
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.email")} *
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ion.popescu@exemplu.ro"
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
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
              {t("programare.submitRequest")}{" "}
              <ChevronRight size={24} />
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
