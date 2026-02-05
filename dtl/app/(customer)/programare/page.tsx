import { redirect } from "next/navigation";
import { getFeatureFlags, isAnyBookingEnabled } from "@/lib/feature-flags";
import BookingForm from "@/components/BookingForm";
import { t } from "@/lib/i18n";

export default async function ProgramarePage() {
  const flags = await getFeatureFlags();
  if (!isAnyBookingEnabled(flags)) {
    redirect("/");
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-6">{t("programare.title")}</h1>
      <BookingForm flags={flags} />
    </main>
  );
}
