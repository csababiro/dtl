"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Building2, MessageCircle } from "lucide-react";
import { useContactSettings } from "@/lib/hooks/useContactSettings";
import { t } from "@/lib/i18n";

export function AdminContactClient() {
  const { settings, setSettings, loading, error, save } = useContactSettings();
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await save(settings);
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
      {error && (
        <p className="px-6 pt-4 text-sm text-red-600">{error.message}</p>
      )}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            {t("admin.contactCompanyName")}
          </label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) =>
              setSettings((f) => ({ ...f, companyName: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Nexora Service Auto"
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
                value={settings.phone}
                onChange={(e) =>
                  setSettings((f) => ({ ...f, phone: e.target.value }))
                }
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t("admin.contactWhatsApp") || "WhatsApp (număr pentru link)"}
            </label>
            <div className="relative">
              <MessageCircle
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="tel"
                value={settings.whatsapp}
                onChange={(e) =>
                  setSettings((f) => ({ ...f, whatsapp: e.target.value }))
                }
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="+40 744 927 038 (opțional; dacă gol, se folosește telefonul)"
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
                value={settings.email}
                onChange={(e) =>
                  setSettings((f) => ({ ...f, email: e.target.value }))
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
              value={settings.address}
              onChange={(e) =>
                setSettings((f) => ({ ...f, address: e.target.value }))
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
            disabled={loading}
            className="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
