import { t } from "@/lib/i18n";
import { getClients } from "@/lib/api/clients";
import { AdminClientsClient } from "@/components/AdminClientsClient";

export default async function AdminClientsPage() {
  const result = await getClients();
  const clients = "data" in result ? result.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          {t("admin.clients")}
        </h1>
        <p className="text-slate-500 mt-1">
          Listă clienți. Caută și sortează după nume.
        </p>
      </div>

      <AdminClientsClient clients={clients} />
    </div>
  );
}
