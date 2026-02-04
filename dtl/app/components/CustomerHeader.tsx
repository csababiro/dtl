"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getFeatureFlags,
  type FeatureFlags,
  isAnyBookingEnabled,
  isCardInstallmentEnabled,
} from "@/lib/feature-flags";
import { ContactStrip } from "./ContactStrip";
import { t } from "@/lib/i18n";

export function CustomerHeader() {
  const [flags, setFlags] = useState<FeatureFlags | null>(null);

  useEffect(() => {
    getFeatureFlags().then(setFlags);
  }, []);

  const showProgramare = flags ? isAnyBookingEnabled(flags) : true;
  const showCardInstallment = flags ? isCardInstallmentEnabled(flags) : true;

  return (
    <header className="border-b border-zinc-200 bg-white px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <nav className="flex flex-wrap items-center gap-4">
          <Link href="/" className="font-medium text-zinc-900 hover:text-zinc-600">
            {t("common", "home")}
          </Link>
          <Link href="/servicii" className="text-zinc-600 hover:text-zinc-900">
            {t("common", "services")}
          </Link>
          {showProgramare && (
            <Link href="/programare" className="text-zinc-600 hover:text-zinc-900">
              {t("common", "booking")}
            </Link>
          )}
          <Link href="/contact" className="text-zinc-600 hover:text-zinc-900">
            {t("common", "contact")}
          </Link>
          <Link href="/cont" className="ml-auto text-zinc-600 hover:text-zinc-900">
            {t("common", "myAccount")}
          </Link>
        </nav>
        <ContactStrip />
      </div>
      {showCardInstallment && (
        <p className="mt-2 text-sm text-zinc-500">
          {t("common", "cardInstallmentBanner")}
        </p>
      )}
    </header>
  );
}
