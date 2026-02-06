import { t } from "@/lib/i18n";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        {t("admin.users")}
      </h1>
      <p className="text-slate-600">Utilizatori – placeholder.</p>
    </div>
  );
}
