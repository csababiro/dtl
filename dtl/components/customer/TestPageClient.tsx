"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { t } from "@/lib/i18n";

export function TestPageClient() {
  const [siteUrl, setSiteUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSiteUrl(window.location.origin);
    }
  }, []);

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
    </div>
  );
}
