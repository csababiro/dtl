import Link from "next/link";
import { Wrench } from "lucide-react";
import { t } from "@/lib/i18n";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-xl shadow-blue-600/30">
            <Wrench className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            {t("admin.loginTitle")}
          </h1>
          <p className="text-slate-500">{t("admin.loginSubtitle")}</p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-2xl">
          <AdminLoginForm />
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-slate-400 hover:text-blue-600 transition-colors"
            >
              {t("admin.backToSite")}
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-700 font-medium uppercase tracking-widest">
          {t("admin.secureBadge")}
        </p>
      </div>
    </div>
  );
}
