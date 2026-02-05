import { getFeatureFlags, isModuleEnabled, isAnyBookingEnabled } from "@/lib/feature-flags";
import { getBusinessSettings } from "@/lib/settings";
import { t } from "@/lib/i18n";
import Link from "next/link";
import { Map } from "@/components/Map";

export default async function HomePage() {
  const [flags, settings] = await Promise.all([
    getFeatureFlags(),
    getBusinessSettings(),
  ]);

  const showTyre = isModuleEnabled(flags, "tyre");
  const showCarWash = isModuleEnabled(flags, "carWash");
  const showProgramare = isAnyBookingEnabled(flags);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <section className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-zinc-900 md:text-4xl">
          {t("home.heroTitle")}
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          {t("home.heroSubtitle")}
        </p>
        {showProgramare && (
          <Link
            href="/programare"
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            {t("home.ctaRezerva")}
          </Link>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900">{t("home.contactUs")}</h2>
        <ul className="mt-4 flex flex-wrap gap-6">
          <li>{t("home.serviceGeneral")}</li>
          {showTyre && <li>{t("home.serviceTyre")}</li>}
          {showCarWash && <li>{t("home.serviceCarWash")}</li>}
        </ul>
      </section>

      {settings.address && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">{t("home.address")}</h2>
          <p className="mt-2 text-zinc-600">{settings.address}</p>
          <div className="mt-4">
            <Map address={settings.address} className="rounded-lg" />
          </div>
        </section>
      )}
    </div>
  );
}
