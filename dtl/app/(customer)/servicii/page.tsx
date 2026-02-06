import Link from "next/link";
import { Wrench, Shield, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { getFeatureFlags } from "@/lib/feature-flags";
import { getBusinessSettings } from "@/lib/settings";
import { t } from "@/lib/i18n";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { isModuleEnabled, isAnyBookingEnabled } from "@/lib/feature-flags";

const SERVICE_GENERAL_IMG =
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1080";
const SERVICE_TYRE_IMG =
  "https://images.unsplash.com/photo-1675034743126-0f250a5fee51?q=80&w=1080";
const SERVICE_WASH_IMG =
  "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=1080";

export default async function ServiciiPage() {
  const flags = await getFeatureFlags();
  const settings = await getBusinessSettings();
  const showTyre = isModuleEnabled(flags, "tyre");
  const showCarWash = isModuleEnabled(flags, "carWash");
  const showBooking = isAnyBookingEnabled(flags);

  const categories = [
    {
      id: "general",
      title: t("home.serviceGeneral"),
      icon: Wrench,
      img: SERVICE_GENERAL_IMG,
      show: true,
      items: [
        { name: "Revizie periodică (Ulei + Filtre)", price: "de la 450 RON" },
        { name: "Sistem de frânare (Plăcuțe/Discuri)", price: "de la 150 RON" },
        { name: "Diagnoză computerizată", price: "de la 100 RON" },
      ],
    },
    {
      id: "anvelope",
      title: t("home.serviceTyre"),
      icon: Shield,
      img: SERVICE_TYRE_IMG,
      show: showTyre,
      items: [
        { name: "Schimb anvelope (set 4)", price: "de la 160 RON" },
        { name: "Echilibrare roți", price: "de la 60 RON" },
        { name: "Geometrie roți 3D", price: "de la 150 RON" },
      ],
    },
    {
      id: "spalatorie",
      title: t("home.serviceCarWash"),
      icon: Clock,
      img: SERVICE_WASH_IMG,
      show: showCarWash,
      items: [
        { name: "Spălare exterior + interior", price: "de la 60 RON" },
        { name: "Ceară lichidă profesională", price: "30 RON" },
        { name: "Cosmetizare interior completă", price: "de la 450 RON" },
      ],
    },
  ].filter((c) => c.show);

  return (
    <div className="flex flex-col">
      <section className="bg-slate-900 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            {t("servicii.title")}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Oferim o gamă completă de servicii pentru mașina ta, utilizând
            echipamente de ultimă generație.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 w-full">
        <div className="space-y-32">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className={`flex flex-col lg:flex-row gap-16 items-center ${
                idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="lg:w-1/2 w-full">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
                  <ImageWithFallback
                    src={cat.img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-900/10" />
                </div>
              </div>
              <div className="lg:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                    <cat.icon size={32} />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900">
                    {cat.title}
                  </h2>
                </div>
                <ul className="space-y-4 mb-8">
                  {cat.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-4 py-2 border-b border-slate-100"
                    >
                      <span className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2
                          size={20}
                          className="text-blue-600 shrink-0"
                        />
                        {item.name}
                      </span>
                      <span className="text-sm font-bold text-slate-500">
                        {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
                {showBooking && (
                  <Link
                    href="/programare"
                    className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all w-fit"
                  >
                    {t("servicii.requestAppointment")}{" "}
                    <ArrowRight size={20} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
        {categories.length === 0 && (
          <p className="text-center text-slate-500 py-12">
            {t("servicii.noServices")}
          </p>
        )}
      </section>
    </div>
  );
}
