import { getFeatureFlags } from "@/lib/feature-flags";
import { t } from "@/lib/i18n";
import Link from "next/link";
import { isAnyBookingEnabled } from "@/lib/feature-flags";

export default async function ProgramarePage() {
  const flags = await getFeatureFlags();
  const showBooking = isAnyBookingEnabled(flags);

  if (!showBooking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {t("programare.title")}
        </h1>
        <p className="text-slate-600 mb-4">{t("errors.featureDisabled")}</p>
        <Link href="/" className="text-blue-600 hover:underline">
          {t("nav.home")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        {t("programare.title")}
      </h1>
      <p className="text-slate-600">Conținut programare – placeholder.</p>
    </div>
  );
}
