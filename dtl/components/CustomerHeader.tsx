import Link from "next/link";
import { t } from "@/lib/i18n";
import type { FeatureFlags } from "@/lib/feature-flags";
import {
  isAnyBookingEnabled,
} from "@/lib/feature-flags";
import ContactStrip from "./ContactStrip";

/**
 * Customer header – nav links (respecting feature flags) and ContactStrip.
 * Pass flags from layout (flags as first argument).
 */
export default function CustomerHeader({
  flags,
  phone,
  email,
}: {
  flags: FeatureFlags;
  phone?: string;
  email?: string;
}) {
  return (
    <header className="border-b p-4 flex flex-wrap items-center gap-4">
      <nav className="flex flex-wrap gap-4">
        <Link href="/" className="font-medium">
          {t("nav.home")}
        </Link>
        <Link href="/servicii">{t("nav.servicii")}</Link>
        {isAnyBookingEnabled(flags) && (
          <Link href="/programare">{t("nav.programare")}</Link>
        )}
        <Link href="/contact">{t("nav.contact")}</Link>
        <Link href="/cont">{t("nav.cont")}</Link>
      </nav>
      <div className="ml-auto">
        <ContactStrip phone={phone} email={email} />
      </div>
      <Link href="/admin/login" className="text-sm text-gray-500">
        {t("admin.login")}
      </Link>
    </header>
  );
}
