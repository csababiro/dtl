"use client";

import { useEffect } from "react";
import Link from "next/link";
import { UserPlus, X } from "lucide-react";
import { t } from "@/lib/i18n";
import {
  recordCreateAccountOffer,
  recordCreateAccountResponse,
  type InterestSource,
} from "@/lib/create-account-interest";

const SIGNUP_PREFILL_KEY = "dtl_signup_prefill";

export interface CreateAccountPromptModalProps {
  open: boolean;
  onClose: () => void;
  source: InterestSource;
  email?: string;
  name?: string;
  phone?: string;
}

export function CreateAccountPromptModal({
  open,
  onClose,
  source,
  email,
  name,
  phone,
}: CreateAccountPromptModalProps) {
  useEffect(() => {
    if (open) {
      recordCreateAccountOffer(source, email);
    }
  }, [open, source, email]);

  if (!open) return null;

  const handleCreateAccount = () => {
    recordCreateAccountResponse(source, "create_account", email);
    if (typeof window !== "undefined" && (name ?? email ?? phone)) {
      try {
        sessionStorage.setItem(
          SIGNUP_PREFILL_KEY,
          JSON.stringify({
            name: name?.trim() || "",
            email: email?.trim() || "",
            phone: phone?.trim() || "",
          })
        );
      } catch {
        /* ignore */
      }
    }
    onClose();
  };

  const handleLater = () => {
    recordCreateAccountResponse(source, "later", email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        aria-hidden
        onClick={handleLater}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-account-prompt-title"
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-8"
      >
        <button
          type="button"
          onClick={handleLater}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          aria-label={t("common.close")}
        >
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <UserPlus size={32} />
          </div>
          <h2
            id="create-account-prompt-title"
            className="text-2xl font-black text-slate-900 mb-3"
          >
            {t("common.createAccountPromptTitle")}
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {t("common.createAccountPromptMessage")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href="/cont?tab=signUp"
              onClick={handleCreateAccount}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {t("common.createAccountCta")}
            </Link>
            <button
              type="button"
              onClick={handleLater}
              className="flex-1 px-6 py-4 rounded-xl font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
            >
              {t("common.createAccountLater")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
