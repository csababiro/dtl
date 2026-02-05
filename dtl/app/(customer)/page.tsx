import Link from "next/link";
import { t } from "@/lib/i18n";
import { getFeatureFlags, isModuleEnabled, isAnyBookingEnabled } from "@/lib/feature-flags";
import Map from "@/components/Map";

export default async function HomePage() {
  const flags = await getFeatureFlags();
  const showTyre = isModuleEnabled(flags, "tyre");
  const showCarWash = isModuleEnabled(flags, "carWash");
  const showProgramare = isAnyBookingEnabled(flags);

  return (
    <main className="p-6">
      <section className="mb-8">
        <h1 className="text-3xl font-bold">{t("home.hero")}</h1>
        <p className="mt-2 text-gray-600">
          Revizie, anvelope, spălătorie – toate serviciile la un loc.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Categorii servicii</h2>
        <ul className="flex flex-wrap gap-4">
          <li>
            <Link href="/servicii" className="text-blue-600 underline font-medium">
              Servicii generale
            </Link>
          </li>
          {showTyre && (
            <li>
              <Link href="/servicii#tyre" className="text-blue-600 underline font-medium">
                Anvelope
              </Link>
            </li>
          )}
          {showCarWash && (
            <li>
              <Link href="/servicii#carwash" className="text-blue-600 underline font-medium">
                Spălătorie
              </Link>
            </li>
          )}
        </ul>
        {showProgramare && (
          <p className="mt-4">
            <Link
              href="/programare"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t("nav.programare")}
            </Link>
          </p>
        )}
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Adresă</h2>
        <p className="text-gray-600">— (setare din Admin)</p>
        <div className="mt-4">
          <Map address="—" />
        </div>
      </section>
    </main>
  );
}
