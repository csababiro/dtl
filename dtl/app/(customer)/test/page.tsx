import Link from "next/link";
import { t } from "@/lib/i18n";
import { TestPageClient } from "@/components/customer/TestPageClient";
import { getFeatureFlags, isTestPageEnabled } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";

export default async function TestPage() {
  const flags = await getFeatureFlags();
  if (!isTestPageEnabled(flags)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {t("nav.test")}
        </h1>
        <p className="text-slate-600 mb-4">{t("errors.featureDisabled")}</p>
        <Link href="/" className="text-blue-600 hover:underline">
          {t("nav.home")}
        </Link>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto text-center space-y-8">
          <h1 className="text-3xl font-black text-slate-900">
            {t("nav.test")}
          </h1>
          <div className="flex flex-col gap-6">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center px-6 py-4 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-900 transition-colors"
            >
              {t("test.adminLink")}
            </Link>
            <TestPageClient />
          </div>
        </div>
      </section>
    </div>
  );
}
