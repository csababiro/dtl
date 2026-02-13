import { get } from "@/lib/api-client";
import { t } from "@/lib/i18n";
import { AdminQuotesClient } from "@/components/AdminQuotesClient";
import { markQuotePrepared } from "./actions";
import type { QuoteRequest } from "@/lib/quote-requests-store";

export type { QuoteRequest };

export default async function AdminQuotesPage() {
  const result = await get<{ items: QuoteRequest[] }>("/quote-requests");
  const items = "data" in result ? result.data.items : [];

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
