"use client";

import { Bell, Search } from "lucide-react";
import { t } from "@/lib/i18n";

export function AdminHeader() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-xl w-96 max-w-full">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          type="search"
          placeholder={t("admin.searchPlaceholder")}
          className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
          aria-label={t("common.search")}
        />
      </div>
      <div className="flex items-center gap-6">
        <button
          type="button"
          className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          aria-label={t("admin.notifications")}
        >
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="h-8 w-px bg-slate-200" aria-hidden />
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700 hidden sm:inline">
            {t("admin.staffDashboard")}
          </span>
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            S
          </div>
        </div>
      </div>
    </header>
  );
}
