"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import type { FeatureFlags } from "@/lib/feature-flags";
import { isBookingEnabled } from "@/lib/feature-flags";

type BookingType = "general" | "tyre" | "carWash";

/**
 * Programare booking form. Fields per design-preparation §1.3.
 * Submit = appointment request (API or mock). Errors via small popup/message.
 */
export default function BookingForm({ flags }: { flags: FeatureFlags }) {
  const [bookingType, setBookingType] = useState<BookingType>("general");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [problem, setProblem] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const showGeneral = isBookingEnabled(flags, "general");
  const showTyre = isBookingEnabled(flags, "tyre");
  const showCarWash = isBookingEnabled(flags, "carWash");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Mock submit – in real app call API
    try {
      await new Promise((r) => setTimeout(r, 300));
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare la trimitere");
    }
  };

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 p-4 text-green-800">
        Cererea a fost trimisă. Veți primi un email de confirmare.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {/* Booking type tabs */}
      {(showGeneral || showTyre || showCarWash) && (
        <div className="flex gap-2 border-b pb-2">
          {showGeneral && (
            <button
              type="button"
              onClick={() => setBookingType("general")}
              className={`px-3 py-1 rounded text-sm ${
                bookingType === "general"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              General
            </button>
          )}
          {showTyre && (
            <button
              type="button"
              onClick={() => setBookingType("tyre")}
              className={`px-3 py-1 rounded text-sm ${
                bookingType === "tyre" ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            >
              Anvelope
            </button>
          )}
          {showCarWash && (
            <button
              type="button"
              onClick={() => setBookingType("carWash")}
              className={`px-3 py-1 rounded text-sm ${
                bookingType === "carWash"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              Spălătorie
            </button>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Nume *</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Telefon *</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Marca *</label>
          <input
            type="text"
            required
            value={carMake}
            onChange={(e) => setCarMake(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Model *</label>
          <input
            type="text"
            required
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">An *</label>
          <input
            type="text"
            required
            value={carYear}
            onChange={(e) => setCarYear(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Descriere problemă *</label>
        <textarea
          required
          rows={3}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Data preferată *</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ora *</label>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
      {error && (
        <div className="rounded bg-red-50 p-3 text-red-800 text-sm" role="alert">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        {t("common.submit")}
      </button>
    </form>
  );
}
