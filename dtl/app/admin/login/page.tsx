import { t } from "@/lib/i18n";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">{t("admin.loginTitle")}</h1>
        <form className="mt-6 space-y-4">
          <label className="block">
            <span className="block text-sm text-zinc-600">{t("admin.email")}</span>
            <input
              type="email"
              name="email"
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-zinc-600">{t("admin.password")}</span>
            <input
              type="password"
              name="password"
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
          >
            {t("admin.loginSubmit")}
          </button>
        </form>
        <p className="mt-4 text-xs text-zinc-500">
          Pentru development: setați <code className="rounded bg-zinc-100 px-1">NEXT_PUBLIC_MOCK_AUTH=true</code> în .env pentru a accesa panoul fără backend.
        </p>
        <Link href="/" className="mt-4 block text-center text-sm text-blue-600 hover:underline">
          {t("nav.home")}
        </Link>
      </div>
    </main>
  );
}
