import Link from "next/link";
import { getFeatureFlags, isGalleryEnabled } from "@/lib/feature-flags";
import { t } from "@/lib/i18n";
import { ImageWithFallback } from "@/components/ImageWithFallback";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600",
  "https://images.unsplash.com/photo-1675034743126-0f250a5fee51?q=80&w=600",
  "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=600",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600",
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600",
  "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600",
];

export default async function GaleriePage() {
  const flags = await getFeatureFlags();
  const showGallery = isGalleryEnabled(flags);

  if (!showGallery) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {t("galerie.title")}
        </h1>
        <p className="text-slate-600 mb-4">{t("errors.featureDisabled")}</p>
        <Link href="/" className="text-blue-600 hover:underline">
          {t("nav.home")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="bg-slate-900 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            {t("galerie.title")}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {t("galerie.subtitle")}
          </p>
        </div>
      </section>
      <section className="py-20 max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {GALLERY_IMAGES.map((src, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-shadow"
            >
              <ImageWithFallback
                src={src}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
