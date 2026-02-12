import { t } from "@/lib/i18n";
import { AdminTestimonialsClient } from "@/components/AdminTestimonialsClient";

export default function AdminTestimonialsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          {t("admin.testimonialsManagement")}
        </h1>
        <p className="text-slate-500 mt-1">
          {t("admin.testimonialsManagementDesc")}
        </p>
      </div>

      <div className="md:bg-white md:rounded-3xl md:border md:border-slate-100 md:shadow-sm overflow-hidden">
        <div className="p-2 sm:p-4 md:p-6">
          <AdminTestimonialsClient />
        </div>
      </div>
    </div>
  );
}
