import { t } from "@/lib/i18n";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          {t("admin.loginTitle")}
        </h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              {t("admin.email")}
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              {t("admin.password")}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            {t("admin.loginSubmit")}
          </button>
        </form>
      </div>
    </div>
  );
}
