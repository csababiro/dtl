"use client";

import { useEffect, useState } from "react";
import { getFeatureFlags, type FeatureFlags, isModuleEnabled, isBookingEnabled } from "@/lib/feature-flags";
import Link from "next/link";
import { getNamespace } from "@/lib/i18n";

/** Mock services by module (API will provide later). */
const MOCK_SERVICES = {
  general: [
    { id: "1", name: "Schimb ulei", price: "150 lei" },
    { id: "2", name: "Revizie", price: "300 lei" },
  ],
  tyre: [
    { id: "t1", name: "Montaj anvelope", price: "80 lei" },
    { id: "t2", name: "Echilibrare", price: "60 lei" },
  ],
  carWash: [
    { id: "w1", name: "Spălare exterior", price: "50 lei" },
    { id: "w2", name: "Detaliu complet", price: "200 lei" },
  ],
};

export function ServiciiList() {
  const [flags, setFlags] = useState<FeatureFlags | null>(null);
  const servicii = getNamespace("servicii");

  useEffect(() => {
    getFeatureFlags().then(setFlags);
  }, []);

  const showTyre = flags ? isModuleEnabled("tyre", flags) : true;
  const showCarWash = flags ? isModuleEnabled("carWash", flags) : true;
  const showGeneralBooking = flags ? isBookingEnabled("general", flags) : true;
  const showTyreBooking = flags ? isBookingEnabled("tyre", flags) : true;
  const showCarWashBooking = flags ? isBookingEnabled("carWash", flags) : true;

  return (
    <div className="mt-6 space-y-8">
      <section>
        <h2 className="text-lg font-medium text-zinc-900">{getNamespace("home").generalService}</h2>
        <ul className="mt-2 space-y-2">
          {MOCK_SERVICES.general.map((s) => (
            <li key={s.id} className="flex justify-between rounded border border-zinc-100 bg-white px-3 py-2">
              <span>{s.name}</span>
              <span className="text-zinc-600">{s.price}</span>
            </li>
          ))}
        </ul>
        {showGeneralBooking && (
          <Link href="/programare" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
            {servicii.requestAppointment}
          </Link>
        )}
      </section>
      {showTyre && (
        <section>
          <h2 className="text-lg font-medium text-zinc-900">{getNamespace("home").tyreService}</h2>
          <ul className="mt-2 space-y-2">
            {MOCK_SERVICES.tyre.map((s) => (
              <li key={s.id} className="flex justify-between rounded border border-zinc-100 bg-white px-3 py-2">
                <span>{s.name}</span>
                <span className="text-zinc-600">{s.price}</span>
              </li>
            ))}
          </ul>
          {showTyreBooking && (
            <Link href="/programare" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
              {servicii.requestAppointment}
            </Link>
          )}
        </section>
      )}
      {showCarWash && (
        <section>
          <h2 className="text-lg font-medium text-zinc-900">{getNamespace("home").carWash}</h2>
          <ul className="mt-2 space-y-2">
            {MOCK_SERVICES.carWash.map((s) => (
              <li key={s.id} className="flex justify-between rounded border border-zinc-100 bg-white px-3 py-2">
                <span>{s.name}</span>
                <span className="text-zinc-600">{s.price}</span>
              </li>
            ))}
          </ul>
          {showCarWashBooking && (
            <Link href="/programare" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
              {servicii.requestAppointment}
            </Link>
          )}
        </section>
      )}
    </div>
  );
}
