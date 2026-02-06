import { get } from "@/lib/api-client";
import { t } from "@/lib/i18n";
import Link from "next/link";

export interface QuoteRequest {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  carMake: string;
  carModel: string;
  carYear: string;
  description: string;
  photoUrl?: string;
  status?: string;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "…";
}

export default async function AdminQuotesPage() {
  const result = await get<{ items: QuoteRequest[] }>("/quote-requests");
  const items: QuoteRequest[] =
    "data" in result && result.data?.items ? result.data.items : [];
  const hasError = "error" in result;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        {t("admin.quotes")}
      </h1>
      {hasError ? (
        <p className="text-red-600 mb-4">{t("errors.network")}</p>
      ) : null}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Mașină</th>
              <th className="px-4 py-2">Descriere</th>
              <th className="px-4 py-2">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  {t("admin.noData")}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-4 py-2">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">
                    <div>{item.phone}</div>
                    <div className="text-slate-600 text-sm">{item.email}</div>
                  </td>
                  <td className="px-4 py-2">
                    {item.carMake} {item.carModel} {item.carYear}
                  </td>
                  <td className="px-4 py-2 max-w-[200px]">
                    {truncate(item.description, 80)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 flex-wrap">
                      <Link
                        href={`tel:${item.phone}`}
                        className="text-blue-600 hover:underline min-h-[44px] min-w-[44px] inline-flex items-center"
                        aria-label={t("admin.contactCustomer")}
                      >
                        Sună
                      </Link>
                      <Link
                        href={`sms:${item.phone}`}
                        className="text-blue-600 hover:underline min-h-[44px] min-w-[44px] inline-flex items-center"
                      >
                        SMS
                      </Link>
                      <Link
                        href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline min-h-[44px] min-w-[44px] inline-flex items-center"
                      >
                        WhatsApp
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
