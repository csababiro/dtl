"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFeatureFlags, type FeatureFlags, isModuleEnabled, isBookingEnabled } from "@/lib/feature-flags";
import { t, getNamespace } from "@/lib/i18n";

export function HomeServiceCategories() {
  const [flags, setFlags] = useState<FeatureFlags | null>(null);
  const home = getNamespace("home");

  useEffect(() => {
    getFeatureFlags().then(setFlags);
  }, []);

  const showTyre = flags ? isModuleEnabled("tyre", flags) : true;
  const showCarWash = flags ? isModuleEnabled("carWash", flags) : true;
  const showGeneralBooking = flags ? isBookingEnabled("general", flags) : true;
  const showTyreBooking = flags ? isBookingEnabled("tyre", flags) : true;
  const showCarWashBooking = flags ? isBookingEnabled("carWash", flags) : true;

  return (
    <div className="mt-4 flex flex-wrap gap-4">
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm min-w-[180px]">
        <h3 className="font-semibold text-zinc-900">{home.generalService}</h3>
        {showGeneralBooking && (
          <Link href="/programare" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
            {t("servicii", "requestAppointment")}
          </Link>
        )}
      </div>
      {showTyre && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm min-w-[180px]">
          <h3 className="font-semibold text-zinc-900">{home.tyreService}</h3>
          {showTyreBooking && (
            <Link href="/programare" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
              {t("servicii", "requestAppointment")}
            </Link>
          )}
        </div>
      )}
      {showCarWash && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm min-w-[180px]">
          <h3 className="font-semibold text-zinc-900">{home.carWash}</h3>
          {showCarWashBooking && (
            <Link href="/programare" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
              {t("servicii", "requestAppointment")}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
