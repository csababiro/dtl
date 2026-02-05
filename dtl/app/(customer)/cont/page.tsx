import { t } from "@/lib/i18n";
import Link from "next/link";

export default function ContPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{t("cont.title")}</h1>

      <section className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-6">
        <p className="text-zinc-700">{t("cont.encourageAccount")}</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <span className="inline-flex min-h-[44px] items-center rounded-md border border-zinc-300 bg-white px-4 text-zinc-700">
            {t("cont.signIn")}
          </span>
          <span className="inline-flex min-h-[44px] items-center rounded-md border border-zinc-300 bg-white px-4 text-zinc-700">
            {t("cont.signUp")}
          </span>
        </div>
        <p className="mt-4 text-sm text-zinc-500">
          {t("cont.promoConsent")}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium text-zinc-900">{t("cont.appointmentHistory")}</h2>
        <p className="mt-2 text-zinc-600">{t("cont.noAppointments")}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium text-zinc-900">{t("cont.invoices")}</h2>
        <p className="mt-2 text-zinc-600">{t("cont.noInvoices")}</p>
      </section>

      <p className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          {t("nav.home")}
        </Link>
      </p>
    </div>
  );
}
