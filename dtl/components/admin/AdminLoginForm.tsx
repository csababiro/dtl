"use client";

import { useState } from "react";
import { Mail, Lock, ChevronRight, Eye, EyeOff } from "lucide-react";
import { t } from "@/lib/i18n";
import { EMAIL_MAX, PASSWORD_MAX } from "@/lib/field-limits";

const inputBase =
  "w-full p-4 pl-12 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all";
const inputNormal = "border-slate-200";
const inputError = "border-red-500";

type Props = { error?: string | null };

export function AdminLoginForm({ error }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action="/api/auth/login" method="POST" className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
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
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="admin@dtl-auto.ro"
            required
            maxLength={EMAIL_MAX}
            className={`${inputBase} ${error ? inputError : inputNormal}`}
          />
        </div>
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
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            maxLength={PASSWORD_MAX}
            className={`${inputBase} pr-12 ${error ? inputError : inputNormal}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
      >
        {t("admin.loginSubmit")}{" "}
        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform shrink-0" />
      </button>
    </form>
  );
}
