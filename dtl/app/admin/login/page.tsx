import { t } from "@/lib/i18n";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          {t("admin.loginTitle")}
        </h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}
