import { t } from "@/lib/i18n";
import { Lock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminDisabledPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <Lock className="text-amber-600" size={28} />
        </div>
        <h1 className="text-xl font-black text-slate-900 mb-2">
          {t("admin.panelDisabledTitle")}
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          {t("admin.panelDisabledDesc")}
        </p>
        <Link
          href="/admin/logout"
          className="inline-block px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          {t("nav.logout")}
        </Link>
      </div>
    </div>
  );
}
