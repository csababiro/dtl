import { t } from "@/lib/i18n";
import { AdminGalleryClient } from "@/components/AdminGalleryClient";

export default function AdminGalleryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          {t("admin.galleryManagement")}
        </h1>
        <p className="text-slate-500 mt-1">
          {t("admin.galleryManagementDesc")}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6">
          <AdminGalleryClient />
        </div>
      </div>
    </div>
  );
}
