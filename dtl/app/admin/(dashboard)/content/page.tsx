import { t } from "@/lib/i18n";

export default function AdminContentPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        {t("admin.content")}
      </h1>
      <p className="text-slate-600">Conținut – placeholder.</p>
    </div>
  );
}
