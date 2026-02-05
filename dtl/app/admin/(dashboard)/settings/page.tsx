import { t } from "@/lib/i18n";

export default function AdminSettingsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{t("admin.settings")}</h1>
      <section className="mt-8 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-zinc-900">{t("admin.contactInfo")}</h2>
          <p className="mt-2 text-sm text-zinc-600">Telefon, email, WhatsApp opțional.</p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-zinc-900">{t("contact.address")}</h2>
          <p className="mt-2 text-sm text-zinc-600">Adresa business pentru hartă și afișare.</p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-zinc-900">{t("admin.operatingHours")}</h2>
          <p className="mt-2 text-sm text-zinc-600">Program per zi; excepții (sărbători RO, zile libere).</p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-zinc-900">{t("admin.slotDuration")}</h2>
          <p className="mt-2 text-sm text-zinc-600">Durată slot (default 1h) pentru Service general, Anvelope, Spălătorie.</p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-zinc-900">{t("admin.cardInstallmentMessage")}</h2>
          <p className="mt-2 text-sm text-zinc-600">Mesaj configurable pentru plăți în rate (când flag activ).</p>
        </div>
      </section>
    </main>
  );
}
