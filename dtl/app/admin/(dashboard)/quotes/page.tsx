import { getQuoteRequests, type QuoteRequest } from "@/lib/quote-requests-store";
import { t } from "@/lib/i18n";
import { AdminQuotesClient } from "@/components/AdminQuotesClient";
import { markQuotePrepared } from "./actions";

export type { QuoteRequest };

export default function AdminQuotesPage() {
  const items = getQuoteRequests();

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
