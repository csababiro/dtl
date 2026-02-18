import { t } from "@/lib/i18n";
import { AdminClientsClient } from "@/components/admin/AdminClientsClient";

export default function AdminClientsPage() {
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

      <AdminClientsClient />
    </div>
  );
}
