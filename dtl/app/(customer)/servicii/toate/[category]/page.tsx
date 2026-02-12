import Link from "next/link";
import { notFound } from "next/navigation";
import { Wrench, Shield, Clock, ArrowRight } from "lucide-react";
import { getFeatureFlags } from "@/lib/feature-flags";
import { t } from "@/lib/i18n";
import {
  isModuleEnabled,
  isAnyBookingEnabled,
  isServicePriceVisible,
  isTyrePriceVisible,
  isCarWashPriceVisible,
} from "@/lib/feature-flags";
import {
  type ServiceCategoryId,
  SERVICES_BY_CATEGORY,
} from "@/lib/services-data";

const CATEGORY_IDS: ServiceCategoryId[] = ["general", "anvelope", "spalatorie"];

const CATEGORY_META: Record<
  ServiceCategoryId,
  { titleKey: string; icon: typeof Wrench }
> = {
  general: { titleKey: "home.serviceGeneral", icon: Wrench },
  anvelope: { titleKey: "home.serviceTyre", icon: Shield },
  spalatorie: { titleKey: "home.serviceCarWash", icon: Clock },
};

export default async function ServiciiToateCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = categorySlug as ServiceCategoryId;
  if (!categorySlug || !CATEGORY_IDS.includes(category)) notFound();

  const flags = await getFeatureFlags();
  const showTyre = isModuleEnabled(flags, "tyre");
  const showCarWash = isModuleEnabled(flags, "carWash");
  const showBooking = isAnyBookingEnabled(flags);
  const showServicePrices = isServicePriceVisible(flags);
  const showTyrePrices = isTyrePriceVisible(flags);
  const showCarWashPrices = isCarWashPriceVisible(flags);

  const categoryAllowed =
    category === "general" ||
    (category === "anvelope" && showTyre) ||
    (category === "spalatorie" && showCarWash);
  if (!categoryAllowed) notFound();

  const showPrice =
    category === "general"
      ? showServicePrices
      : category === "anvelope"
        ? showTyrePrices
        : showCarWashPrices;
  const meta = CATEGORY_META[category];
  const items = SERVICES_BY_CATEGORY[category];

  return (
    <div className="flex flex-col">
      <section className="bg-slate-900 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            {t("servicii.allServicesTitle")} – {t(meta.titleKey)}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Lista serviciilor pentru {t(meta.titleKey).toLowerCase()}.
          </p>
          <Link
            href="/servicii"
            className="inline-block mt-6 text-blue-400 hover:text-blue-300 font-bold transition-colors"
          >
            ← {t("servicii.title")}
          </Link>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-4 w-full">
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
              key={i}
              className="flex items-center justify-between gap-4 px-6 py-4 bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-800">{item.name}</span>
              {showPrice && (
                <span className="text-sm font-bold text-slate-500 shrink-0">
                  {item.price}
                </span>
              )}
            </li>
          ))}
        </ul>

        {showBooking && (
          <div className="text-center pt-8">
            <Link
              href={
                category === "general"
                  ? "/programare?tab=general"
                  : category === "anvelope"
                    ? "/programare?tab=tyre"
                    : "/programare?tab=carWash"
              }
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              {t("servicii.requestAppointment")} <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
