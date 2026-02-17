import Link from "next/link";
import { Wrench, Shield, Clock, ArrowRight } from "lucide-react";
import { getFeatureFlags } from "@/lib/feature-flags";
import { t } from "@/lib/i18n";
import {
  isModuleEnabled,
  isBookingEnabled,
  isServicePriceVisible,
  isTyrePriceVisible,
  isCarWashPriceVisible,
} from "@/lib/feature-flags";
import type { ServiceCategoryId } from "@/lib/services-data";
import { getServicesForDisplay } from "@/lib/get-services-for-display";

const CATEGORY_META: Record<
  ServiceCategoryId,
  { titleKey: string; icon: typeof Wrench }
> = {
  general: { titleKey: "home.serviceGeneral", icon: Wrench },
  anvelope: { titleKey: "home.serviceTyre", icon: Shield },
  spalatorie: { titleKey: "home.serviceCarWash", icon: Clock },
};

export const dynamic = "force-dynamic";

export default async function ServiciiToatePage() {
  const flags = await getFeatureFlags();
  const showTyre = isModuleEnabled(flags, "tyre");
  const showCarWash = isModuleEnabled(flags, "carWash");
  const showBooking = isBookingEnabled(flags, "general");
  const showServicePrices = isServicePriceVisible(flags);
  const showTyrePrices = isTyrePriceVisible(flags);
  const showCarWashPrices = isCarWashPriceVisible(flags);

  const allCategories = [
    { id: "general" as ServiceCategoryId, showPrice: showServicePrices, show: true },
    { id: "anvelope" as ServiceCategoryId, showPrice: showTyrePrices, show: showTyre },
    { id: "spalatorie" as ServiceCategoryId, showPrice: showCarWashPrices, show: showCarWash },
  ];
  const categories = allCategories.filter((c) => c.show);

  const categoryItems = await Promise.all(
    categories.map((cat) => getServicesForDisplay(cat.id))
  );
  const itemsByCategory = Object.fromEntries(
    categories.map((cat, i) => [cat.id, categoryItems[i]])
  );

  return (
    <div className="flex flex-col">
      <section className="bg-slate-900 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            {t("servicii.allServicesTitle")}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Lista completă de servicii oferite de DTL.
          </p>
          <Link
            href="/servicii"
            className="inline-block mt-6 text-blue-400 hover:text-blue-300 font-bold transition-colors"
          >
            ← {t("servicii.title")}
          </Link>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-4 w-full space-y-16">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat.id];
          const items = itemsByCategory[cat.id] ?? [];
          return (
            <div key={cat.id}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <meta.icon size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  {t(meta.titleKey)}
                </h2>
              </div>
              <ul className="space-y-3 border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {items.map((item, i) => (
                  <li
                    key={`${cat.id}-${i}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-slate-800">
                      {item.name}
                    </span>
                    {cat.showPrice && (
                      <span className="text-sm font-bold text-slate-500 shrink-0">
                        {item.price}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {showBooking && (
          <div className="text-center pt-8">
            <Link
              href="/programare"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              {t("servicii.requestAppointment")} <ArrowRight size={20} />
            </Link>
          </div>
        )}

        {categories.length === 0 && (
          <p className="text-center text-slate-500 py-12">
            {t("servicii.noServices")}
          </p>
        )}
      </section>
    </div>
  );
}
