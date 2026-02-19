import Link from "next/link";
import { getFeatureFlags, isTestimonialsEnabled } from "@/lib/feature-flags";
import { t } from "@/lib/i18n";
import { Quote } from "lucide-react";
import { getTestimonials } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function TestimonialePage() {
  const flags = await getFeatureFlags();
  const showTestimonials = isTestimonialsEnabled(flags);

  if (!showTestimonials) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {t("testimoniale.title")}
        </h1>
        <p className="text-slate-600 mb-4">{t("errors.featureDisabled")}</p>
        <Link href="/" className="text-blue-600 hover:underline">
          {t("nav.home")}
        </Link>
      </div>
    );
  }

  const result = await getTestimonials();
  const all = "data" in result ? result.data : [];
  const testimonials = all.filter((tst) => tst.visible);

  return (
    <div className="flex flex-col">
      <section className="bg-slate-900 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            {t("testimoniale.title")}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {t("testimoniale.subtitle")}
          </p>
        </div>
      </section>
      <section className="py-20 max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((tst) => (
            <div
              key={tst.id}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col"
            >
              <Quote size={32} className="text-blue-100 mb-4" />
              <p className="text-slate-700 leading-relaxed mb-6 flex-1">
                „{tst.text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{tst.author}</p>
                  {tst.role && (
                    <p className="text-sm text-slate-500">{tst.role}</p>
                  )}
                </div>
                {tst.rating != null && (
                  <div className="flex gap-0.5" aria-label={`${tst.rating} stele`}>
                    {Array.from({ length: tst.rating }).map((_, j) => (
                      <span key={j} className="text-amber-500" aria-hidden>
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
