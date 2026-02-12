import { t } from "@/lib/i18n";

export default function AdminContentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          {t("admin.content")}
        </h1>
        <p className="text-slate-500 mt-1">
          Conținut – placeholder.
        </p>
      </div>
    </div>
  );
}
