import { t } from "@/lib/i18n";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("admin.login")}</h1>
        <p className="mt-2 text-gray-600">
          Placeholder – backend login will set session (e.g. JWT cookie).
        </p>
        <p className="mt-2 text-sm">
          Set NEXT_PUBLIC_MOCK_AUTH=true to access admin without backend.
        </p>
      </div>
    </main>
  );
}
