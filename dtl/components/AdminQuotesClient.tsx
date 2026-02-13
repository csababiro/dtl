"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import type { QuoteRequest } from "@/lib/quote-requests-store";

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

function MarkPreparedButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 disabled:opacity-50 min-h-[44px]"
    >
      {pending ? "..." : t("admin.markPrepared")}
    </button>
  );
}

interface AdminQuotesClientProps {
  items: QuoteRequest[];
  onMarkPrepared: (prev: unknown, formData: FormData) => Promise<{ ok: boolean }>;
}

export function AdminQuotesClient({ items, onMarkPrepared }: AdminQuotesClientProps) {
  const router = useRouter();

  return (
    <>
      {/* Mobile: cards - click card to open details */}
      <div className="md:hidden space-y-4">
        {items.length === 0 ? (
          <p className="py-8 text-center text-slate-500">{t("admin.noData")}</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/admin/quotes/${item.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/admin/quotes/${item.id}`);
                }
              }}
              className="block bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3 hover:bg-slate-50/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-slate-900">{item.name}</span>
                <span
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold text-center ${
                    (item.status ?? "pending") === "prepared"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {(item.status ?? "pending") === "prepared"
                    ? "Pregătit"
                    : t("admin.pending")}
                </span>
              </div>
              <p className="text-sm text-slate-500">{formatDate(item.createdAt)}</p>
              <div className="text-sm text-slate-700">
                <a
                  href={`tel:${item.phone}`}
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.phone}
                </a>
                <br />
                <a
                  href={`mailto:${item.email}`}
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.email}
                </a>
              </div>
              <p className="text-sm text-slate-600">
                {item.carMake} {item.carModel} {item.carYear}
              </p>
              <div
                className="flex flex-nowrap items-center gap-2 pt-2 border-t border-slate-100"
                onClick={(e) => e.stopPropagation()}
              >
                {(item.status ?? "pending") !== "prepared" && (
                  <form action={onMarkPrepared} className="inline shrink-0" onClick={(e) => e.stopPropagation()}>
                    <input type="hidden" name="id" value={item.id} />
                    <MarkPreparedButton />
                  </form>
                )}
                <a
                  href={`tel:${item.phone}`}
                  className="text-blue-600 hover:underline text-sm font-medium shrink-0 whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  Sună
                </a>
                <a
                  href={`sms:${item.phone}`}
                  className="text-blue-600 hover:underline text-sm font-medium shrink-0 whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  SMS
                </a>
                <a
                  href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm font-medium shrink-0 whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block border rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[640px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Mașină</th>
              <th className="px-4 py-2 text-center">Status</th>
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
                <tr
                  key={item.id}
                  className="border-t border-slate-200 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => router.push(`/admin/quotes/${item.id}`)}
                >
                  <td className="px-4 py-2">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">
                    <div>{item.phone}</div>
                    <div className="text-slate-600 text-sm">{item.email}</div>
                  </td>
                  <td className="px-4 py-2">
                    {item.carMake} {item.carModel} {item.carYear}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-center ${
                        (item.status ?? "pending") === "prepared"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {(item.status ?? "pending") === "prepared"
                        ? "Pregătit"
                        : t("admin.pending")}
                    </span>
                  </td>
                  <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2 flex-nowrap items-center">
                      {(item.status ?? "pending") !== "prepared" && (
                        <form action={onMarkPrepared} className="inline">
                          <input type="hidden" name="id" value={item.id} />
                          <MarkPreparedButton />
                        </form>
                      )}
                      <Link
                        href={`tel:${item.phone}`}
                        className="text-blue-600 hover:underline min-h-[44px] min-w-[44px] inline-flex items-center shrink-0"
                        aria-label={t("admin.contactCustomer")}
                      >
                        Sună
                      </Link>
                      <Link
                        href={`sms:${item.phone}`}
                        className="text-blue-600 hover:underline min-h-[44px] min-w-[44px] inline-flex items-center shrink-0"
                      >
                        SMS
                      </Link>
                      <Link
                        href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline min-h-[44px] min-w-[44px] inline-flex items-center shrink-0 whitespace-nowrap"
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
    </>
  );
}
