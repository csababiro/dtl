"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { t } from "@/lib/i18n";

const ADMIN_SESSION_COOKIE = "dtl_admin_session";
const COOKIE_MAX_AGE_DAYS = 1;

function setAdminSessionCookie() {
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${ADMIN_SESSION_COOKIE}=mock; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function AdminLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setAdminSessionCookie();
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {t("admin.email")}
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {t("admin.password")}
        </label>
        <input
          id="password"
          type="password"
          name="password"
          required
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? t("common.loading") : t("admin.loginSubmit")}
      </button>
    </form>
  );
}
