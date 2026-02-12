"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { t } from "@/lib/i18n";
import {
  type ServiceCategoryId,
  SERVICES_BY_CATEGORY,
} from "@/lib/services-data";

const TABS: { id: ServiceCategoryId; labelKey: string }[] = [
  { id: "general", labelKey: "admin.servicesTabGeneral" },
  { id: "anvelope", labelKey: "admin.servicesTabAnvelope" },
  { id: "spalatorie", labelKey: "admin.servicesTabSpalatorie" },
];

export function AdminServicesClient() {
  const [activeTab, setActiveTab] = useState<ServiceCategoryId>("general");
  const items = SERVICES_BY_CATEGORY[activeTab];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {t("admin.servicesManagement")}
          </h1>
          <p className="text-slate-500 mt-1">
            {t("admin.servicesManagementDesc")}
          </p>
        </div>
        <button
          type="button"
          disabled
          title={t("admin.apiLater")}
          className="bg-slate-200 text-slate-500 px-6 py-3 rounded-xl font-bold cursor-not-allowed flex items-center gap-2"
        >
          <Plus size={20} /> {t("admin.addService")}
        </button>
      </div>

      <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-2xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-700">
            {t("admin.servicesListFor")}: {t(TABS.find((t) => t.id === activeTab)!.labelKey)}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
            <CheckCircle2 size={14} className="text-green-500" /> Auto-update activ
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  {t("admin.serviceName")}
                </th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  {t("admin.priceDisplayed")}
                </th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                  {t("admin.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-900">{s.name}</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-black text-sm">
                      {s.price}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled
                        title={t("admin.apiLater")}
                        className="p-2 text-slate-300 cursor-not-allowed rounded-lg"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        type="button"
                        disabled
                        title={t("admin.apiLater")}
                        className="p-2 text-slate-300 cursor-not-allowed rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
