import { t } from "@/lib/i18n";
import { Wrench } from "lucide-react";

export function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <Wrench className="text-slate-500" size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-3">
          {t("admin.maintenanceTitle")}
        </h1>
        <p className="text-slate-600">
          {t("admin.maintenanceDesc")}
        </p>
      </div>
    </div>
  );
}
