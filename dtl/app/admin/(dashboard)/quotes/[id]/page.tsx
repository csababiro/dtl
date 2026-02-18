"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getQuoteRequestById } from "@/lib/api/quote-requests";
import { AdminQuoteDetailClient } from "@/components/admin/AdminQuoteDetailClient";
import type { QuoteRequest } from "@/lib/quote-requests-store";
import { t } from "@/lib/i18n";

export default function AdminQuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const [item, setItem] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const refetch = () => {
    if (!id) return;
    getQuoteRequestById(id).then((result) => {
      if ("data" in result && result.data) setItem(result.data);
    });
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    getQuoteRequestById(id).then((result) => {
      if (cancelled) return;
      if ("error" in result || !result.data) {
        setNotFound(true);
      } else {
        setItem(result.data);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (notFound) {
    router.replace("/admin/quotes");
    return null;
  }
  if (loading || !item) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/quotes"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft size={20} />
          Înapoi la cereri ofertă
        </Link>
        <p className="text-slate-500">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/quotes"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
      >
        <ArrowLeft size={20} />
        Înapoi la cereri ofertă
      </Link>
      <h1 className="text-3xl font-black text-slate-900">
        Cerere ofertă · {item.name}
      </h1>
      <AdminQuoteDetailClient item={item} onRefetch={refetch} />
    </div>
  );
}
