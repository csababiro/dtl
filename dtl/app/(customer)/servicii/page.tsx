import { getFeatureFlags, isModuleEnabled, isAnyBookingEnabled } from "@/lib/feature-flags";
import { getGeneralServices, getTyreServices, getCarWashServices } from "@/lib/services-api";
import { t } from "@/lib/i18n";
import Link from "next/link";

export default async function ServiciiPage() {
  const flags = await getFeatureFlags();
  const [general, tyre, carWash] = await Promise.all([
    getGeneralServices(),
    isModuleEnabled(flags, "tyre") ? getTyreServices() : Promise.resolve([]),
    isModuleEnabled(flags, "carWash") ? getCarWashServices() : Promise.resolve([]),
  ]);

  const sections: { title: string; items: { id: string; name: string; price?: number | null; imageUrl?: string | null }[] }[] = [];
  if (general.length) sections.push({ title: t("home.serviceGeneral"), items: general });
  if (tyre.length) sections.push({ title: t("home.serviceTyre"), items: tyre });
  if (carWash.length) sections.push({ title: t("home.serviceCarWash"), items: carWash });

  const showProgramare = isAnyBookingEnabled(flags);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{t("servicii.title")}</h1>

      {sections.length === 0 ? (
        <p className="mt-6 text-zinc-600">{t("servicii.noServices")}</p>
      ) : (
        <div className="mt-8 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-medium text-zinc-900">{section.title}</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {section.items.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="mb-3 h-32 w-full rounded object-cover"
                      />
                    )}
                    <p className="font-medium text-zinc-900">{item.name}</p>
                    {item.price != null && (
                      <p className="mt-1 text-sm text-zinc-600">
                        {t("servicii.from")} {item.price} RON
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {showProgramare && (
        <div className="mt-10">
          <Link
            href="/programare"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            {t("servicii.requestAppointment")}
          </Link>
        </div>
      )}
    </div>
  );
}
