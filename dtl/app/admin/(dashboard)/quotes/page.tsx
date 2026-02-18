import { t } from "@/lib/i18n";
import { AdminQuotesClient } from "@/components/admin/AdminQuotesClient";

export default function AdminQuotesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          {t("admin.quotes")}
        </h1>
        <p className="text-slate-500 mt-1">
          Marchează cererile ca „Pregătit pentru client” după ce oferta e pregătită.
        </p>
      </div>
      <AdminQuotesClient />
    </div>
  );
}
