import { AdminOrarClient } from "@/components/AdminOrarClient";
import { t } from "@/lib/i18n";

export default function AdminOrarPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          {t("admin.orar")}
        </h1>
        <p className="text-slate-500 mt-1">
          {t("admin.orarDescription")}
        </p>
      </div>
      <AdminOrarClient />
    </div>
  );
}
