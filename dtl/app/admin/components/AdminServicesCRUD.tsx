"use client";

import { useState } from "react";

/**
 * Service and pricing CRUD: General, Tyre, Car Wash (separate sections).
 * Optional booking lists with default Romanian labels (Specs §5.2).
 */
const DEFAULT_GENERAL = ["Schimb ulei", "Revizie", "Frâne", "Filtre", "Direcție", "Diagnostic motor", "Baterie", "Climatizare", "Rotație anvelope"];
const DEFAULT_TYRE = ["Montaj anvelope", "Echilibrare", "Reparare pană", "Schimb valve"];
const DEFAULT_CARWASH = ["Spălare exterior", "Spălare interior", "Detaliu exterior", "Detaliu complet"];

type Section = "general" | "tyre" | "carWash";

export function AdminServicesCRUD() {
  const [section, setSection] = useState<Section>("general");
  const [generalItems] = useState(DEFAULT_GENERAL);
  const [tyreItems] = useState(DEFAULT_TYRE);
  const [carWashItems] = useState(DEFAULT_CARWASH);

  const labels: Record<Section, string> = {
    general: "Service general",
    tyre: "Anvelope",
    carWash: "Spălătorie",
  };
  const items = section === "general" ? generalItems : section === "tyre" ? tyreItems : carWashItems;

  return (
    <div className="mt-6">
      <div className="flex gap-2 border-b border-zinc-200">
        {(Object.keys(labels) as Section[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSection(key)}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              section === key ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {labels[key]}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-medium">{labels[section]}</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Adaugă/modifică servicii și prețuri. Lista opțională pentru programare (default în română):
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-700">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-zinc-500">
          Formular CRUD (nume, preț) va fi completat cu API-ul.
        </p>
      </div>
    </div>
  );
}
