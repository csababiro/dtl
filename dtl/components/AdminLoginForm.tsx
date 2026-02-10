"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { t } from "@/lib/i18n";

const ADMIN_SESSION_COOKIE = "dtl_admin_session";
const COOKIE_MAX_AGE_DAYS = 1;

function setAdminSessionCookie() {
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${ADMIN_SESSION_COOKIE}=mock; path=/; max-age=${maxAge}; SameSite=Lax`;
}

type AdminLoginFormValues = { email: string; password: string };

const inputBase = "w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border transition-all";
const inputNormal = "border-slate-300";
const inputError = "border-red-500";

export function AdminLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({ mode: "onChange" });

  function onSubmit(data: AdminLoginFormValues) {
    setLoading(true);
    // Simulated auth failure: show error under email the same way as real auth would
    if (data.password === "fail") {
      setError("email", { type: "server", message: t("errors.invalidCredentials") });
      setLoading(false);
      return;
    }
    setAdminSessionCookie();
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          {...register("email", {
          required: t("errors.completeThisField"),
          validate: (v) =>
            !v || v.includes("@") ? true : t("errors.emailIncludeAt"),
        })}
          className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
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
          {...register("password", { required: t("errors.completeThisField") })}
          className={`${inputBase} ${errors.password ? inputError : inputNormal}`}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
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
