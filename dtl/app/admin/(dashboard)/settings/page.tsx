import { t } from "@/lib/i18n";
import { AdminContactClient } from "@/components/admin/AdminContactClient";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          {t("admin.settings")}
        </h1>
        <p className="text-slate-500 mt-1">
          Setări generale și date de contact.
        </p>
      </div>

      <AdminContactClient />
    </div>
  );
}
