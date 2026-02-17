import Link from "next/link";
import { getFeatureFlags, isGalleryEnabled } from "@/lib/feature-flags";
import { t } from "@/lib/i18n";
import { GalleryWithLightbox } from "@/components/customer/GalleryWithLightbox";
import { getGalleryItems } from "@/lib/services";

export const dynamic = "force-dynamic";

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

  const result = await getGalleryItems();
  const items = "data" in result ? result.data : [];
  const images = items.map((i) => i.imageUrl);

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
        <GalleryWithLightbox images={images} />
      </section>
    </div>
  );
}
