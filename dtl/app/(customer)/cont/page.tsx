import Link from "next/link";
import { getFeatureFlags, isAuthenticationEnabled } from "@/lib/feature-flags";
import { t } from "@/lib/i18n";
import { ContPageClient } from "@/components/ContPageClient";

export default async function ContPage() {
  const flags = await getFeatureFlags();
  const showAuth = isAuthenticationEnabled(flags);

  if (!showAuth) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {t("cont.title")}
        </h1>
        <p className="text-slate-600 mb-4">{t("errors.featureDisabled")}</p>
        <Link href="/" className="text-blue-600 hover:underline">
          {t("nav.home")}
        </Link>
      </div>
    );
  }

  return <ContPageClient />;
}
