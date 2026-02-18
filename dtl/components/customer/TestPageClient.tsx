"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Share2 } from "lucide-react";
import { t } from "@/lib/i18n";

export function TestPageClient() {
  const [siteUrl, setSiteUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSiteUrl(window.location.origin);
    }
  }, []);

  const copyPageLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : siteUrl || "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!siteUrl) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 flex items-center justify-center min-h-[240px]">
        <p className="text-slate-500 text-sm">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col items-center gap-4">
      <p className="text-sm font-bold text-slate-600">
        {t("test.qrLabel")}
      </p>
      <div className="p-4 bg-white rounded-xl border border-slate-100">
        <QRCodeSVG value={siteUrl} size={200} level="M" />
      </div>
      <p className="text-xs text-slate-500 break-all max-w-[280px] text-center">
        {siteUrl}
      </p>
      <button
        type="button"
        onClick={copyPageLink}
        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        title={t("test.shareHint")}
      >
        <Share2 size={18} aria-hidden />
        {copied ? t("test.linkCopied") : t("test.share")}
      </button>
    </div>
  );
}
