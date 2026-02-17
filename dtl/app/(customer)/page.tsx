import Link from "next/link";
import {
  Wrench,
  Shield,
  Clock,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { getFeatureFlags } from "@/lib/feature-flags";
import { getBusinessSettings } from "@/lib/settings";
import { t } from "@/lib/i18n";
import { getMapsUrl } from "@/lib/maps";
import { InteractiveMap } from "@/components/customer/InteractiveMap";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { isBookingEnabled, isModuleEnabled } from "@/lib/feature-flags";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1080";

const SERVICE_GENERAL_IMG =
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1080";
const SERVICE_TYRE_IMG =
  "https://images.unsplash.com/photo-1675034743126-0f250a5fee51?q=80&w=1080";
const SERVICE_WASH_IMG =
  "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=1080";

function formatHours(hours: Record<string, string> | undefined): string {
  if (!hours) return "";
  const order = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  return order
    .map((k) => {
      const label =
        k === "monday"
          ? "Luni"
          : k === "tuesday"
            ? "Marți"
            : k === "wednesday"
              ? "Miercuri"
              : k === "thursday"
                ? "Joi"
                : k === "friday"
                  ? "Vineri"
                  : k === "saturday"
                    ? "Sâmbătă"
                    : "Duminică";
      return `${label}: ${hours[k] ?? "—"}`;
    })
    .join("\n");
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const flags = await getFeatureFlags();
  const settings = await getBusinessSettings();
  const showBooking = isBookingEnabled(flags, "general");
  const showTyre = isModuleEnabled(flags, "tyre");
  const showCarWash = isModuleEnabled(flags, "carWash");

  type ProgramareTab = "general" | "tyre" | "carWash";
  type ServiceItem = {
    title: string;
    desc: string;
    icon: typeof Wrench;
    img: string;
    show: boolean;
    programareTab: ProgramareTab;
  };
  const services: ServiceItem[] = (
    [
      {
        title: t("home.serviceGeneral"),
        desc: "Revizii, frâne, suspensie, motor și diagnoză computerizată completă.",
        icon: Wrench,
        img: SERVICE_GENERAL_IMG,
        show: true,
        programareTab: "general" as const,
      },
      {
        title: t("home.serviceTyre"),
        desc: "Montaj, echilibrare, hotel anvelope și geometrie roți 3D.",
        icon: Shield,
        img: SERVICE_TYRE_IMG,
        show: showTyre,
        programareTab: "tyre" as const,
      },
      {
        title: t("home.serviceCarWash"),
        desc: "Spălare profesională, detailing interior și cosmetizare.",
        icon: Clock,
        img: SERVICE_WASH_IMG,
        show: showCarWash,
        programareTab: "carWash" as const,
      },
    ] as ServiceItem[]
  ).filter((s) => s.show);

  const heroSubtitleParts = [t("home.serviceGeneral")];
  if (showTyre) heroSubtitleParts.push(t("home.serviceTyre"));
  if (showCarWash) heroSubtitleParts.push(t("home.serviceCarWash"));
  const heroSubtitle =
    heroSubtitleParts.join(", ") + t("home.heroSubtitleSuffix");

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[360px] h-[70vh] sm:h-[500px] lg:h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={HERO_IMAGE}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
              {t("home.heroTitle").split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-blue-500 underline decoration-4 underline-offset-8">
                complete
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {showBooking && (
                <Link
                  href="/programare"
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group"
                >
                  {t("home.ctaRezerva")}
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              )}
              <Link
                href="/servicii"
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
              >
                Vezi serviciile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-24 max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-xl">
            <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">
              Ce oferim
            </p>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">
              Expertiză tehnică pentru orice marcă auto
            </h2>
          </div>
          <Link
            href="/servicii"
            className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
          >
            Toate serviciile <ArrowRight size={20} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 transition-all hover:shadow-2xl hover:shadow-blue-900/5"
            >
              <div className="h-48 overflow-hidden relative">
                <ImageWithFallback
                  src={s.img}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-blue-600 p-2 rounded-lg text-white">
                  <s.icon size={24} />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {s.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{s.desc}</p>
                {showBooking && (
                  <Link
                    href={`/programare?tab=${s.programareTab}`}
                    className="font-bold text-blue-600 flex items-center gap-2"
                  >
                    Programează <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">
              De ce DTL?
            </p>
            <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">
              Pasiune pentru mecanică, respect pentru client
            </h2>
            <div className="space-y-8">
              {[
                {
                  t: "Piese de origine",
                  d: "Folosim doar piese omologate și oferim garanție pentru orice lucrare.",
                },
                {
                  t: "Transparență totală",
                  d: "Primești deviz detaliat și ești consultat înainte de orice operațiune suplimentară.",
                },
                {
                  t: "Echipamente moderne",
                  d: "Atelierul nostru este dotat cu cele mai noi tehnologii de diagnoză și reparație.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{item.t}</h4>
                    <p className="text-slate-600">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={HERO_IMAGE}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-blue-600 text-white p-10 rounded-3xl shadow-2xl hidden lg:block">
              <p className="text-5xl font-black mb-2">Experiență</p>
              <p className="text-lg font-bold opacity-80 uppercase tracking-widest">
                și dedicare
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map & Contact */}
      <section className="py-24 max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-black text-slate-900 mb-8">
              {t("home.address")}
            </h2>
            <div className="space-y-6">
              {settings.address && (
                <div className="flex items-start gap-4">
                  <MapPin
                    className="text-blue-600 shrink-0 mt-1"
                    size={24}
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">Adresă</h4>
                    <a
                      href={getMapsUrl(settings.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      {settings.address}
                    </a>
                  </div>
                </div>
              )}
              {settings.phone && (
                <div className="flex items-start gap-4">
                  <Phone
                    className="text-blue-600 shrink-0 mt-1"
                    size={24}
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">Telefon</h4>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-slate-600 hover:text-blue-600"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>
              )}
              {settings.email && (
                <div className="flex items-start gap-4">
                  <Mail
                    className="text-blue-600 shrink-0 mt-1"
                    size={24}
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">Email</h4>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-slate-600 hover:text-blue-600"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
            {settings.hours && Object.keys(settings.hours).length > 0 && (
              <div className="mt-12 p-8 bg-blue-50 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2">
                  Program de lucru
                </h4>
                <p className="text-blue-800/70 text-sm whitespace-pre-line">
                  {formatHours(settings.hours)}
                </p>
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            <InteractiveMap
              address={settings.address}
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}
              className="min-h-[400px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
