import { t } from "@/lib/i18n";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">{t("admin.settings")}</h1>
      <div className="max-w-2xl space-y-6">
        <section className="border rounded-lg p-4">
          <h2 className="font-medium mb-3">Contact</h2>
          <p className="text-sm text-gray-500">Telefon, email (setări business)</p>
          <p className="mt-2 text-gray-600">— (API)</p>
        </section>
        <section className="border rounded-lg p-4">
          <h2 className="font-medium mb-3">Adresă</h2>
          <p className="text-sm text-gray-500">Adresa afișată și pe hartă</p>
          <p className="mt-2 text-gray-600">— (API)</p>
        </section>
        <section className="border rounded-lg p-4">
          <h2 className="font-medium mb-3">Program</h2>
          <p className="text-sm text-gray-500">Pe zile, excepții, sărbători RO</p>
          <p className="mt-2 text-gray-600">— (API)</p>
        </section>
        <section className="border rounded-lg p-4">
          <h2 className="font-medium mb-3">Durată slot (General / Anvelope / Spălătorie)</h2>
          <p className="text-sm text-gray-500">Implicit 1h fiecare</p>
          <p className="mt-2 text-gray-600">— (API)</p>
        </section>
        <section className="border rounded-lg p-4">
          <h2 className="font-medium mb-3">Mesaj plată rate (card)</h2>
          <p className="text-sm text-gray-500">Când flag Card Installment este activ</p>
          <p className="mt-2 text-gray-600">— (API)</p>
        </section>
      </div>
    </div>
  );
}
