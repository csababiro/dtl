import Link from "next/link";
import { t } from "@/lib/i18n";
import type { FeatureFlags } from "@/lib/feature-flags";
import { isAnyBookingEnabled } from "@/lib/feature-flags";
import { ContactStrip } from "./ContactStrip";

export interface HeaderProps {
  flags: FeatureFlags;
  logoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
}

export function Header({
  flags,
  logoUrl,
  phone,
  email,
  whatsapp,
}: HeaderProps) {
  const showProgramare = isAnyBookingEnabled(flags);

  return (
    <header className="border-b border-zinc-200 bg-white">
      <ContactStrip
        phone={phone}
        email={email}
        whatsapp={whatsapp}
      />
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-zinc-900 hover:text-blue-600"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span>{t("nav.home")}</span>
          )}
        </Link>
        <nav className="flex flex-wrap items-center gap-4" aria-label="Principal">
          <Link
            href="/"
            className="min-h-[44px] min-w-[44px] inline-flex items-center text-zinc-700 hover:text-blue-600"
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/servicii"
            className="min-h-[44px] min-w-[44px] inline-flex items-center text-zinc-700 hover:text-blue-600"
          >
            {t("nav.servicii")}
          </Link>
          {showProgramare && (
            <Link
              href="/programare"
              className="min-h-[44px] min-w-[44px] inline-flex items-center rounded-md bg-blue-600 px-4 text-white hover:bg-blue-700"
            >
              {t("nav.programare")}
            </Link>
          )}
          <Link
            href="/contact"
            className="min-h-[44px] min-w-[44px] inline-flex items-center text-zinc-700 hover:text-blue-600"
          >
            {t("nav.contact")}
          </Link>
          <Link
            href="/cont"
            className="min-h-[44px] min-w-[44px] inline-flex items-center text-zinc-700 hover:text-blue-600"
          >
            {t("nav.cont")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
