"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, ChevronRight } from "lucide-react";
import { t } from "@/lib/i18n";
import { EMAIL_MAX, PASSWORD_MAX } from "@/lib/field-limits";

const ADMIN_SESSION_COOKIE = "dtl_admin_session";
const COOKIE_MAX_AGE_DAYS = 1;

function setAdminSessionCookie() {
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${ADMIN_SESSION_COOKIE}=mock; path=/; max-age=${maxAge}; SameSite=Lax`;
}

type AdminLoginFormValues = { email: string; password: string };

const inputBase =
  "w-full p-4 pl-12 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all";
const inputNormal = "border-slate-200";
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-bold text-slate-700 block"
        >
          {t("admin.email")} Staff
        </label>
        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            id="email"
            type="text"
            inputMode="email"
            autoComplete="email"
            placeholder="admin@dtl-auto.ro"
            {...register("email", {
              required: t("errors.completeThisField"),
              validate: (v) =>
                !v || v.includes("@") ? true : t("errors.emailIncludeAt"),
            })}
            maxLength={EMAIL_MAX}
            className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-bold text-slate-700 block"
        >
          {t("admin.password")}
        </label>
        <div className="relative">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password", { required: t("errors.completeThisField") })}
            maxLength={PASSWORD_MAX}
            className={`${inputBase} ${errors.password ? inputError : inputNormal}`}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
      >
        {loading ? t("common.loading") : t("admin.loginSubmit")}{" "}
        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform shrink-0" />
      </button>
    </form>
  );
}
