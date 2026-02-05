import { t } from "@/lib/i18n";

export default function AdminServicesPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">{t("admin.services")}</h1>
      <div className="space-y-6">
        <section className="border rounded-lg p-4">
          <h2 className="font-medium mb-2">Servicii generale (prețuri)</h2>
          <p className="text-sm text-gray-500">CRUD + listă opțională programare (default RO)</p>
        </section>
        <section className="border rounded-lg p-4">
          <h2 className="font-medium mb-2">Servicii anvelope (prețuri)</h2>
          <p className="text-sm text-gray-500">CRUD + listă opțională programare</p>
        </section>
        <section className="border rounded-lg p-4">
          <h2 className="font-medium mb-2">Pachete spălătorie (prețuri)</h2>
          <p className="text-sm text-gray-500">CRUD + listă opțională programare</p>
        </section>
      </div>
    </div>
  );
}
