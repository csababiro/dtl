"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Building2 } from "lucide-react";
import { get, put } from "@/lib/api-client";
import type { ContactSettings } from "@/lib/contact-settings";
import { t } from "@/lib/i18n";

export function AdminContactClient() {
  const [form, setForm] = useState<ContactSettings>({
    companyName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const result = await get<ContactSettings>("/settings/contact");
      if ("data" in result && result.data) {
        setForm((prev) => ({ ...prev, ...result.data }));
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await put<ContactSettings, ContactSettings>("/settings/contact", form);
    if ("error" in result) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
          <Building2 size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {t("admin.contactSectionTitle")}
          </h2>
          <p className="text-sm text-slate-500">{t("admin.contactSectionDesc")}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            {t("admin.contactCompanyName")}
          </label>
          <input
            type="text"
            value={form.companyName}
            onChange={(e) =>
              setForm((f) => ({ ...f, companyName: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="DTL Service"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin.contactPhone")}
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin.contactEmail")}
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            {t("admin.contactAddress")}
          </label>
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-4 top-4 text-slate-400 shrink-0"
            />
            <textarea
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              rows={2}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Strada, număr, oraș, județ"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {t("common.save")}
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-600">Salvat.</span>
          )}
        </div>
      </form>
    </div>
  );
}
