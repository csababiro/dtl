"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getFeatureFlags,
  type FeatureFlags,
  type BookingType,
  isBookingEnabled,
  isAnyBookingEnabled,
} from "@/lib/feature-flags";
import { t } from "@/lib/i18n";

const TABS: { key: BookingType; labelKey: string }[] = [
  { key: "general", labelKey: "tabGeneral" },
  { key: "tyre", labelKey: "tabTyre" },
  { key: "carWash", labelKey: "tabWash" },
];

export function ProgramareForm() {
  const router = useRouter();
  const [flags, setFlags] = useState<FeatureFlags | null>(null);
  const [activeTab, setActiveTab] = useState<BookingType>("general");

  useEffect(() => {
    getFeatureFlags().then(setFlags);
  }, []);

  useEffect(() => {
    if (flags && !isAnyBookingEnabled(flags)) {
      router.replace("/");
      return;
    }
  }, [flags, router]);

  const visibleTabs = TABS.filter((tab) => flags && isBookingEnabled(tab.key, flags));
  const defaultTab = visibleTabs[0]?.key ?? "general";
  const currentTab = visibleTabs.some((t) => t.key === activeTab) ? activeTab : defaultTab;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // API submission in Phase 2/backend; for now just alert
    alert("Cererea de programare va fi trimisă. (Integrare API în faza următoare.)");
  };

  if (!flags) {
    return <p className="mt-2 text-zinc-600">Se încarcă...</p>;
  }

  if (!isAnyBookingEnabled(flags)) {
    return null;
  }

  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-200">
        {visibleTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              currentTab === tab.key
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {t("programare", tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Form (initial booking type = selected tab; user can change via tabs) */}
      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4">
        <input type="hidden" name="bookingType" value={currentTab} />
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
            Nume *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-700">
            Telefon *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="carMake" className="block text-sm font-medium text-zinc-700">
            Mașină (Marca, Model, An) *
          </label>
          <input
            id="carMake"
            name="carMake"
            type="text"
            placeholder="ex. Dacia Sandero, 2020"
            required
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="problem" className="block text-sm font-medium text-zinc-700">
            Descriere problemă *
          </label>
          <textarea
            id="problem"
            name="problem"
            rows={3}
            required
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-zinc-700">
            Data preferată *
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-zinc-700">
            Ora preferată *
          </label>
          <input
            id="time"
            name="time"
            type="time"
            required
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-zinc-700">
            Atașare poză (opțional)
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            className="mt-1 w-full text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Trimite cererea
        </button>
      </form>
    </div>
  );
}
