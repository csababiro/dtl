"use client";

import { useState } from "react";

/**
 * User management: staff (Admin, Technician) create/edit; customers list; staff can create customer accounts.
 */
export function AdminUsersList() {
  const [activeTab, setActiveTab] = useState<"staff" | "customers">("staff");

  return (
    <div className="mt-6">
      <div className="flex gap-2 border-b border-zinc-200">
        <button
          type="button"
          onClick={() => setActiveTab("staff")}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            activeTab === "staff" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-600 hover:text-zinc-900"
          }`}
        >
          Staff
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("customers")}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            activeTab === "customers" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-600 hover:text-zinc-900"
          }`}
        >
          Clienți
        </button>
      </div>
      {activeTab === "staff" && (
        <div className="mt-4">
          <p className="text-sm text-zinc-600">
            Super Admin / Admin pot crea conturi Admin și Technician. Roluri: Super Admin, Admin, Technician.
          </p>
          <button
            type="button"
            className="mt-4 rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Adaugă staff (stub)
          </button>
        </div>
      )}
      {activeTab === "customers" && (
        <div className="mt-4">
          <p className="text-sm text-zinc-600">
            Lista clienți; staff poate crea conturi clienți. Autentificare clienți: email/parolă, telefon (SMS), Google.
          </p>
          <button
            type="button"
            className="mt-4 rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Adaugă client (stub)
          </button>
        </div>
      )}
    </div>
  );
}
