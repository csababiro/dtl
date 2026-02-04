"use client";

import { useState } from "react";
import { invalidateFeatureFlagsCache } from "@/lib/feature-flags";

/**
 * Feature flags UI (mock; API will persist later).
 * Super Admin: enable/disable. Admin: show/hide to customers.
 */
const FLAGS = [
  { key: "tyreModule", label: "Modul Anvelope", adminKey: "adminShowTyre" },
  { key: "carWashModule", label: "Modul Spălătorie", adminKey: "adminShowCarWash" },
  { key: "generalServiceBooking", label: "Programare Service general", adminKey: "adminShowGeneralBooking" },
  { key: "tyreServiceBooking", label: "Programare Anvelope", adminKey: "adminShowTyreBooking" },
  { key: "carWashBooking", label: "Programare Spălătorie", adminKey: "adminShowCarWashBooking" },
  { key: "partsOrdering", label: "Comandă piese", adminKey: "adminShowPartsOrdering" },
  { key: "cardInstallment", label: "Plată în rate (reclame)", adminKey: "adminShowCardInstallment" },
] as const;

export function AdminFeatureFlagsForm() {
  const [superOn, setSuperOn] = useState<Record<string, boolean>>(
    Object.fromEntries(FLAGS.map((f) => [f.key, true]))
  );
  const [adminShow, setAdminShow] = useState<Record<string, boolean>>(
    Object.fromEntries(FLAGS.map((f) => [f.adminKey, true]))
  );

  const toggleSuper = (key: string) => {
    setSuperOn((prev) => ({ ...prev, [key]: !prev[key] }));
    invalidateFeatureFlagsCache();
  };
  const toggleAdmin = (key: string) => {
    setAdminShow((prev) => ({ ...prev, [key]: !prev[key] }));
    invalidateFeatureFlagsCache();
  };

  return (
    <div className="mt-6 max-w-2xl space-y-6">
      <p className="text-sm text-zinc-500">
        Super Admin: activează/dezactivează. Admin: afișează/ascunde pentru clienți.
      </p>
      <table className="w-full border-collapse border border-zinc-200">
        <thead>
          <tr className="bg-zinc-50">
            <th className="border border-zinc-200 px-3 py-2 text-left text-sm font-medium">
              Feature
            </th>
            <th className="border border-zinc-200 px-3 py-2 text-left text-sm font-medium">
              Super Admin (on/off)
            </th>
            <th className="border border-zinc-200 px-3 py-2 text-left text-sm font-medium">
              Admin (show/hide)
            </th>
          </tr>
        </thead>
        <tbody>
          {FLAGS.map((f) => (
            <tr key={f.key}>
              <td className="border border-zinc-200 px-3 py-2">{f.label}</td>
              <td className="border border-zinc-200 px-3 py-2">
                <button
                  type="button"
                  onClick={() => toggleSuper(f.key)}
                  className={`rounded px-2 py-1 text-sm ${superOn[f.key] ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-600"}`}
                >
                  {superOn[f.key] ? "ON" : "OFF"}
                </button>
              </td>
              <td className="border border-zinc-200 px-3 py-2">
                <button
                  type="button"
                  onClick={() => toggleAdmin(f.adminKey)}
                  className={`rounded px-2 py-1 text-sm ${adminShow[f.adminKey] ? "bg-blue-100 text-blue-800" : "bg-zinc-100 text-zinc-600"}`}
                >
                  {adminShow[f.adminKey] ? "Show" : "Hide"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-zinc-500">
        Persistența va fi realizată prin API; cache-ul frontend este invalidat la toggle.
      </p>
    </div>
  );
}
