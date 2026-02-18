import Link from "next/link";
import { t } from "@/lib/i18n";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default function OfertaPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
          {t("oferta.cta")}
        </h1>
        <p className="text-lg text-slate-600">
          {t("oferta.description")}
        </p>
        <Link
          href="/oferte-dtl.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors text-lg shadow-lg hover:shadow-xl"
        >
          <FileText size={24} aria-hidden />
          {t("oferta.openDoc")}
        </Link>
      </div>
    </div>
  );
}
