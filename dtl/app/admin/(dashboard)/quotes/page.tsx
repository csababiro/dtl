import { getQuoteRequests } from "@/lib/api/quote-requests";
import { t } from "@/lib/i18n";
import { AdminQuotesClient } from "@/components/admin/AdminQuotesClient";
import { markQuotePrepared } from "./actions";
import type { QuoteRequest } from "@/lib/quote-requests-store";

export type { QuoteRequest };

export default async function AdminQuotesPage() {
  const result = await getQuoteRequests();
  const items = "data" in result ? result.data : [];

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
      <AdminQuotesClient items={items} onMarkPrepared={markQuotePrepared} />
    </div>
  );
}
