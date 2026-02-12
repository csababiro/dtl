import { BookingForm } from "@/components/BookingForm";
import {
  getFeatureFlags,
  isAnyBookingEnabled,
  isBookingEnabled,
} from "@/lib/feature-flags";
import { t } from "@/lib/i18n";
import Link from "next/link";

export default async function ProgramarePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }> | { tab?: string };
}) {
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

  const tabs: { id: string; label: string }[] = [];
  if (isBookingEnabled(flags, "general"))
    tabs.push({ id: "general", label: t("programare.tabGeneral") });
  if (isBookingEnabled(flags, "tyre"))
    tabs.push({ id: "tyre", label: t("programare.tabTyre") });
  if (isBookingEnabled(flags, "carWash"))
    tabs.push({ id: "carWash", label: t("programare.tabCarWash") });

  const resolved =
    typeof (searchParams as Promise<{ tab?: string }>).then === "function"
      ? await (searchParams as Promise<{ tab?: string }>)
      : (searchParams as { tab?: string });
  const tabParam = resolved.tab;
  const defaultTab =
    tabParam && tabs.some((t) => t.id === tabParam) ? tabParam : undefined;

  return <BookingForm tabs={tabs} defaultTab={defaultTab} />;
}
