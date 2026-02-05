import { getFeatureFlags, isBookingEnabled } from "@/lib/feature-flags";
import { getGeneralServices, getTyreServices, getCarWashServices } from "@/lib/services-api";
import { t } from "@/lib/i18n";
import Link from "next/link";
import type { BookingType } from "@/lib/types";
import { ProgramareForm } from "./ProgramareForm";

export default async function ProgramarePage() {
  const flags = await getFeatureFlags();

  const bookingTypes: { type: BookingType; label: string }[] = [];
  if (isBookingEnabled(flags, "general"))
    bookingTypes.push({ type: "general", label: t("programare.tabGeneral") });
  if (isBookingEnabled(flags, "tyre"))
    bookingTypes.push({ type: "tyre", label: t("programare.tabTyre") });
  if (isBookingEnabled(flags, "carWash"))
    bookingTypes.push({ type: "carWash", label: t("programare.tabCarWash") });

  if (bookingTypes.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold">{t("programare.title")}</h1>
        <p className="mt-4 text-zinc-600">{t("errors.featureDisabled")}</p>
        <Link href="/" className="mt-4 inline-block text-blue-600 underline">
          {t("nav.home")}
        </Link>
      </div>
    );
  }

  const [general, tyre, carWash] = await Promise.all([
    getGeneralServices(),
    getTyreServices(),
    getCarWashServices(),
  ]);

  const optionalServicesByType: Record<BookingType, { id: string; name: string; price?: number | null; imageUrl?: string | null }[]> = {
    general,
    tyre,
    carWash,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{t("programare.title")}</h1>
      <ProgramareForm
        bookingTypes={bookingTypes}
        optionalServicesByType={optionalServicesByType}
      />
    </div>
  );
}
