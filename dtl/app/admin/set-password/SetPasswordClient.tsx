"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Wrench } from "lucide-react";
import { t } from "@/lib/i18n";
import { getInvitationInfo } from "./actions";
import { setPasswordFromInvitationAction } from "./actions";

export function SetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [info, setInfo] = useState<{
    ok: true;
    email: string;
    userName: string;
  } | { ok: false; error: string } | null>(null);
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setInfo({ ok: false, error: "invalid" });
      return;
    }
    getInvitationInfo(token).then(setInfo);
  }, [token]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    setPending(true);
    try {
      const res = await setPasswordFromInvitationAction(fd);
      if (!res?.ok && res?.error) {
        setSubmitError(res.error);
        setPending(false);
      }
    } catch {
      setPending(false);
    }
  }

  if (info === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-white">{t("common.loading")}</div>
      </div>
    );
  }

  if (!info.ok) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            {t("admin.setPasswordInvalidTitle")}
          </h1>
          <p className="text-slate-600 mb-6">
            {info.error === "expired"
              ? t("admin.setPasswordExpired")
              : t("admin.setPasswordInvalid")}
          </p>
          <Link
            href="/admin/login"
            className="inline-block px-4 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800"
          >
            {t("admin.backToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-xl shadow-blue-600/30">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            {t("admin.setPasswordTitle")}
          </h1>
          <p className="text-slate-500">
            {t("admin.setPasswordSubtitle")} {info.userName} ({info.email})
          </p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="token" value={token ?? ""} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t("admin.password")}
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder={t("admin.setPasswordPlaceholder")}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">{t("admin.setPasswordMinLength")}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t("admin.setPasswordConfirm")}
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
            </div>
            {submitError && (
              <p className="text-sm text-red-600">
                {submitError === "password_too_short"
                  ? t("admin.setPasswordErrorTooShort")
                  : submitError === "password_mismatch"
                    ? t("admin.setPasswordErrorMismatch")
                    : t("errors.validation")}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Wrench size={20} />
              {pending ? t("common.loading") : t("admin.setPasswordSubmit")}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link
              href="/admin/login"
              className="text-sm text-slate-400 hover:text-blue-600 transition-colors"
            >
              {t("admin.backToLogin")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
