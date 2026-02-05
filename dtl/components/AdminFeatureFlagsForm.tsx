"use client";

import type { FeatureFlags } from "@/lib/feature-flags";

/**
 * Feature flags UI – Super Admin: enable/disable; Admin: show/hide to customers.
 * Persist via API when backend exists; for now display current flags (read-only or local state).
 */
export default function AdminFeatureFlagsForm({
  flags,
}: {
  flags: FeatureFlags;
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm text-gray-500 mb-4">
        Super Admin activează/dezactivează; Admin afișează/ascunde la clienți. Modificările se aplică la salvare (API).
      </p>
      <ul className="space-y-3">
        <li className="flex items-center gap-4 border-b pb-2">
          <span className="w-48">Modul Anvelope</span>
          <span className="text-sm">{flags.tyreModule !== false ? "Activ" : "Inactiv"}</span>
        </li>
        <li className="flex items-center gap-4 border-b pb-2">
          <span className="w-48">Modul Spălătorie</span>
          <span className="text-sm">{flags.carWashModule !== false ? "Activ" : "Inactiv"}</span>
        </li>
        <li className="flex items-center gap-4 border-b pb-2">
          <span className="w-48">Programare general</span>
          <span className="text-sm">{flags.generalBooking !== false ? "Activ" : "Inactiv"}</span>
        </li>
        <li className="flex items-center gap-4 border-b pb-2">
          <span className="w-48">Programare anvelope</span>
          <span className="text-sm">{flags.tyreBooking !== false ? "Activ" : "Inactiv"}</span>
        </li>
        <li className="flex items-center gap-4 border-b pb-2">
          <span className="w-48">Programare spălătorie</span>
          <span className="text-sm">{flags.carWashBooking !== false ? "Activ" : "Inactiv"}</span>
        </li>
        <li className="flex items-center gap-4 border-b pb-2">
          <span className="w-48">Comandă piese</span>
          <span className="text-sm">{flags.partsOrdering !== false ? "Activ" : "Inactiv"}</span>
        </li>
        <li className="flex items-center gap-4 border-b pb-2">
          <span className="w-48">Plată rate card</span>
          <span className="text-sm">{flags.cardInstallment !== false ? "Activ" : "Inactiv"}</span>
        </li>
      </ul>
      <p className="text-xs text-gray-400 mt-6">
        Toggle-uri și salvare vor fi conectate la API când backend este disponibil.
      </p>
    </div>
  );
}
