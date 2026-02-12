import { getQuoteRequests, type QuoteRequest } from "@/lib/quote-requests-store";
import { t } from "@/lib/i18n";
import { AdminQuotesClient } from "@/components/AdminQuotesClient";
import { markQuotePrepared } from "./actions";

export type { QuoteRequest };

export default function AdminQuotesPage() {
  const items = getQuoteRequests();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        {t("admin.quotes")}
      </h1>
      <p className="text-slate-500 mb-4">
        Marchează cererile ca „Pregătit pentru client” după ce oferta e pregătită.
      </p>
      <AdminQuotesClient items={items} onMarkPrepared={markQuotePrepared} />
    </div>
  );
}
