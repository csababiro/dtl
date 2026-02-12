import { notFound } from "next/navigation";
import Link from "next/link";
import { getQuoteRequestById } from "@/lib/quote-requests-store";
import { t } from "@/lib/i18n";
import { AdminQuoteDetailClient } from "@/components/AdminQuoteDetailClient";
import { markQuotePrepared } from "../actions";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminQuoteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = getQuoteRequestById(id);
  if (!item) notFound();

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
      <AdminQuoteDetailClient item={item} onMarkPrepared={markQuotePrepared} />
    </div>
  );
}
