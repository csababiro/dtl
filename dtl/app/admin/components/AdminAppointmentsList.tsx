"use client";

import { useState } from "react";

/**
 * Appointment requests list: confirm (set slot), modify slot, delete.
 * Click-to-call and click-to-SMS (open device dialer/SMS with customer number).
 */
const MOCK_REQUESTS = [
  { id: "1", name: "Ion Popescu", phone: "+40 712 345 678", email: "ion@example.com", status: "pending", type: "general" },
  { id: "2", name: "Maria Ionescu", phone: "+40 723 456 789", email: "maria@example.com", status: "confirmed", type: "tyre" },
];

export function AdminAppointmentsList() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const confirm = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "confirmed" as const } : r)));
  };
  const remove = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;
  const smsHref = (phone: string) => `sms:${phone.replace(/\s/g, "")}`;

  return (
    <div className="mt-6 space-y-4">
      {requests.map((r) => (
        <div
          key={r.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded border border-zinc-200 bg-white p-4 shadow-sm"
        >
          <div>
            <p className="font-medium">{r.name}</p>
            <p className="text-sm text-zinc-600">{r.email} · {r.type}</p>
            <p className="text-sm font-medium text-zinc-700">{r.status}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={telHref(r.phone)}
              className="rounded bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700"
            >
              Sună
            </a>
            <a
              href={smsHref(r.phone)}
              className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
            >
              SMS
            </a>
            {r.status === "pending" && (
              <button
                type="button"
                onClick={() => confirm(r.id)}
                className="rounded bg-zinc-900 px-3 py-1 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Confirmă
              </button>
            )}
            <button
              type="button"
              onClick={() => remove(r.id)}
              className="rounded border border-red-600 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Șterge
            </button>
          </div>
        </div>
      ))}
      {requests.length === 0 && (
        <p className="text-sm text-zinc-500">Nicio cerere de programare.</p>
      )}
    </div>
  );
}
