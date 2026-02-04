"use client";

import { useState } from "react";

/**
 * Business settings form (mock; API will persist later).
 */
export function AdminSettingsForm() {
  const [phone, setPhone] = useState("+40 123 456 789");
  const [email, setEmail] = useState("contact@service.ro");
  const [address, setAddress] = useState("Adresa service");
  const [cardInstallmentMessage, setCardInstallmentMessage] = useState(
    "Plătiți cu cardul în rate la service."
  );

  return (
    <form className="mt-6 max-w-xl space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-zinc-700">
          Telefon
        </label>
        <input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-zinc-700">
          Adresă
        </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="cardMsg" className="block text-sm font-medium text-zinc-700">
          Mesaj Card Installment (doar reclame)
        </label>
        <input
          id="cardMsg"
          type="text"
          value={cardInstallmentMessage}
          onChange={(e) => setCardInstallmentMessage(e.target.value)}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
        />
      </div>
      <p className="text-sm text-zinc-500">
        Program, sărbători RO, zile libere suplimentare și durată slot (General / Anvelope / Spălătorie) vor fi adăugate cu API-ul.
      </p>
      <button
        type="button"
        className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Salvează (stub)
      </button>
    </form>
  );
}
