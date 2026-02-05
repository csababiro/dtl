"use client";

import { useState, useCallback } from "react";
import { t, getMessages } from "@/lib/i18n";
import type { BookingType } from "@/lib/types";
import type { ServiceItem } from "@/lib/types";
import { ErrorToast } from "@/components/ErrorToast";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const msgs = getMessages();

export interface ProgramareFormProps {
  bookingTypes: { type: BookingType; label: string }[];
  optionalServicesByType: Record<BookingType, ServiceItem[]>;
}

function getBaseUrl(): string {
  if (typeof window === "undefined") return "";
  const url = process.env.NEXT_PUBLIC_API_URL;
  return url ? String(url).replace(/\/$/, "") : "";
}

export function ProgramareForm({
  bookingTypes,
  optionalServicesByType,
}: ProgramareFormProps) {
  const [activeType, setActiveType] = useState<BookingType>(bookingTypes[0]?.type ?? "general");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [carProblem, setCarProblem] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchSlots = useCallback(async (type: BookingType, dateVal: string) => {
    if (!dateVal) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    setSlots([]);
    setTime("");
    const base = getBaseUrl();
    try {
      const res = await fetch(
        `${base}/slots?type=${encodeURIComponent(type)}&date=${encodeURIComponent(dateVal)}`
      );
      const data = await res.json();
      setSlots(Array.isArray(data?.slots) ? data.slots : []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const onDateChange = (value: string) => {
    setDate(value);
    fetchSlots(activeType, value);
  };

  const onTypeChange = (type: BookingType) => {
    setActiveType(type);
    setSelectedServiceIds(new Set());
    if (date) fetchSlots(type, date);
    else setSlots([]);
  };

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!date || !time) {
      setError(msgs.errors.validation);
      return;
    }
    setSubmitLoading(true);
    const base = getBaseUrl();
    try {
      const res = await fetch(`${base}/appointments/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeType,
          name,
          phone,
          email,
          carMake,
          carModel,
          carYear,
          carProblem,
          optionalServiceIds: Array.from(selectedServiceIds),
          date,
          time,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.message || res.statusText || msgs.errors.network);
        return;
      }
      setSuccess(true);
    } catch {
      setError(msgs.errors.network);
    } finally {
      setSubmitLoading(false);
    }
  };

  const minDate = new Date().toISOString().slice(0, 10);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().slice(0, 10);

  if (success) {
    return (
      <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6">
        <p className="font-medium text-green-800">{t("programare.successMessage")}</p>
      </div>
    );
  }

  const optionalServices = optionalServicesByType[activeType] ?? [];

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {bookingTypes.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {bookingTypes.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => onTypeChange(type)}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                activeType === type
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <section>
        <h3 className="text-sm font-medium text-zinc-900">{t("programare.customerDetails")}</h3>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="block text-sm text-zinc-600">{t("programare.name")}</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-zinc-600">{t("programare.phone")}</span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="block text-sm text-zinc-600">{t("programare.email")}</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-medium text-zinc-900">{t("programare.carDetails")}</h3>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="block text-sm text-zinc-600">{t("programare.carMake")}</span>
            <input
              type="text"
              required
              value={carMake}
              onChange={(e) => setCarMake(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-zinc-600">{t("programare.carModel")}</span>
            <input
              type="text"
              required
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-zinc-600">{t("programare.carYear")}</span>
            <input
              type="text"
              required
              value={carYear}
              onChange={(e) => setCarYear(e.target.value)}
              placeholder="ex. 2020"
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </label>
        </div>
        <label className="mt-4 block">
          <span className="block text-sm text-zinc-600">{t("programare.carProblem")}</span>
          <textarea
            required
            rows={3}
            value={carProblem}
            onChange={(e) => setCarProblem(e.target.value)}
            placeholder={t("programare.carProblemPlaceholder")}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
          />
        </label>
      </section>

      {optionalServices.length > 0 && (
        <section>
          <h3 className="text-sm font-medium text-zinc-900">{t("programare.optionalServices")}</h3>
          <ul className="mt-2 flex flex-wrap gap-4">
            {optionalServices.map((s) => (
              <label key={s.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedServiceIds.has(s.id)}
                  onChange={() => toggleService(s.id)}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                <span className="text-sm">{s.name}</span>
              </label>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3 className="text-sm font-medium text-zinc-900">{t("programare.selectDate")}</h3>
        <p className="mt-1 text-xs text-zinc-500">{t("programare.bookingWindow")}</p>
        <input
          type="date"
          required
          min={minDate}
          max={maxDateStr}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="mt-2 rounded border border-zinc-300 px-3 py-2"
        />
      </section>

      <section>
        <h3 className="text-sm font-medium text-zinc-900">{t("programare.selectTime")}</h3>
        {slotsLoading && <LoadingSpinner />}
        {!slotsLoading && slots.length === 0 && date && (
          <p className="mt-2 text-sm text-zinc-500">{t("programare.noSlots")}</p>
        )}
        {!slotsLoading && slots.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {slots.map((slot) => (
              <label key={slot} className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center">
                <input
                  type="radio"
                  name="time"
                  required
                  value={slot}
                  checked={time === slot}
                  onChange={(e) => setTime(e.target.value)}
                  className="sr-only"
                />
                <span
                  className={`rounded-md border px-4 py-2 text-sm ${
                    time === slot
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-zinc-300 hover:border-blue-400"
                  }`}
                >
                  {slot}
                </span>
              </label>
            ))}
          </div>
        )}
      </section>

      <p className="text-sm text-zinc-500">{t("programare.attachPhoto")}</p>

      {error && (
        <ErrorToast
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      <button
        type="submit"
        disabled={submitLoading}
        className="flex min-h-[44px] items-center justify-center rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitLoading ? <LoadingSpinner /> : t("programare.submitRequest")}
      </button>
    </form>
  );
}
