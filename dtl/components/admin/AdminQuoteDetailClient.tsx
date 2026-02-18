"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import type { QuoteRequest } from "@/lib/quote-requests-store";
import { User, Phone, Mail, Car, ArrowLeft } from "lucide-react";
import { patch } from "@/lib/api-client";

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

interface AdminQuoteDetailClientProps {
  item: QuoteRequest;
  onRefetch?: () => void | Promise<void>;
}

export function AdminQuoteDetailClient({ item, onRefetch }: AdminQuoteDetailClientProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const isPrepared = (item.status ?? "pending") === "prepared";

  const handleMarkPrepared = async () => {
    setPending(true);
    const res = await patch<QuoteRequest>(`/quote-requests/${item.id}`, { status: "prepared" });
    setPending(false);
    if ("error" in res) {
      if (res.error.status === 401) router.push("/admin/login");
      return;
    }
    if (onRefetch) await onRefetch();
    else router.refresh();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold text-center ${
                isPrepared ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {isPrepared ? "Pregătit" : t("admin.pending")}
            </span>
            <span className="text-sm text-slate-500">{formatDate(item.createdAt)}</span>
          </div>
          {!isPrepared && (
            <button
              type="button"
              onClick={handleMarkPrepared}
              disabled={pending}
              className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 disabled:opacity-50 min-h-[44px]"
            >
              {pending ? "..." : t("admin.markPrepared")}
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 text-slate-700">
            <User size={20} className="text-slate-400 shrink-0" />
            <span className="font-bold text-slate-900">{item.name}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600 sm:col-span-2">
            <Phone size={20} className="text-slate-400 shrink-0" />
            <a href={`tel:${item.phone}`} className="hover:text-blue-600">
              {item.phone}
            </a>
          </div>
          <div className="flex items-center gap-3 text-slate-600 sm:col-span-2">
            <Mail size={20} className="text-slate-400 shrink-0" />
            <a href={`mailto:${item.email}`} className="hover:text-blue-600">
              {item.email}
            </a>
          </div>
          <div className="flex items-center gap-3 text-slate-600 sm:col-span-2">
            <Car size={20} className="text-slate-400 shrink-0" />
            <span>
              {item.carMake} {item.carModel} {item.carYear}
              {item.chassis ? ` · ${item.chassis}` : ""}
            </span>
          </div>
        </div>

        {item.description && (
          <div className="pt-4 border-t border-slate-100">
            <p className="text-sm font-bold text-slate-700 mb-1">Descriere</p>
            <p className="text-slate-600 text-sm whitespace-pre-wrap">{item.description}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
          <Link
            href={`tel:${item.phone}`}
            className="text-blue-600 hover:underline text-sm font-medium shrink-0 whitespace-nowrap"
          >
            Sună
          </Link>
          <Link
            href={`sms:${item.phone}`}
            className="text-blue-600 hover:underline text-sm font-medium shrink-0 whitespace-nowrap"
          >
            SMS
          </Link>
          <Link
            href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm font-medium shrink-0 whitespace-nowrap"
          >
            WhatsApp
          </Link>
        </div>
      </div>
    </div>
  );
}
