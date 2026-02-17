"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { t } from "@/lib/i18n";
import { type ServiceCategoryId } from "@/lib/services-data";
import { useServices } from "@/lib/hooks/useServices";
import type { ServiceRecord } from "@/lib/api/services";

const TABS: { id: ServiceCategoryId; labelKey: string }[] = [
  { id: "general", labelKey: "admin.servicesTabGeneral" },
  { id: "anvelope", labelKey: "admin.servicesTabAnvelope" },
  { id: "spalatorie", labelKey: "admin.servicesTabSpalatorie" },
];

export function AdminServicesClient() {
  const [activeTab, setActiveTab] = useState<ServiceCategoryId>("general");
  const { items, loading, error, addItem, updateItem, removeItem } =
    useServices(activeTab);
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceRecord | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const form = e.currentTarget;
    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim();
    const price = (form.querySelector('[name="price"]') as HTMLInputElement)?.value?.trim() ?? "";
    if (!name) {
      setFormError("Numele serviciului este obligatoriu.");
      return;
    }
    const result = await addItem({ name, price });
    if ("error" in result) {
      setFormError(result.error?.message ?? "Eroare la adăugare.");
      return;
    }
    setShowAdd(false);
    form.reset();
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    setFormError(null);
    const form = e.currentTarget;
    const name = (form.querySelector('[name="editName"]') as HTMLInputElement)?.value?.trim();
    const price = (form.querySelector('[name="editPrice"]') as HTMLInputElement)?.value?.trim() ?? "";
    if (!name) {
      setFormError("Numele serviciului este obligatoriu.");
      return;
    }
    const result = await updateItem(editingItem.id, { name, price });
    if ("error" in result) {
      setFormError(result.error?.message ?? "Eroare la salvare.");
      return;
    }
    setEditingItem(null);
  };

  const handleDelete = async (s: ServiceRecord) => {
    if (!confirm(t("admin.confirmDeleteService"))) return;
    await removeItem(s.id);
  };

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
          onClick={() => {
            setShowAdd(true);
            setEditingItem(null);
            setFormError(null);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
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

      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}

      {showAdd && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">{t("admin.addService")}</h3>
          <form onSubmit={handleAdd} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {t("admin.serviceName")}
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {t("admin.priceDisplayed")}
              </label>
              <input
                name="price"
                type="text"
                placeholder="ex: de la 100 RON"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                {t("admin.addService")}
              </button>
              <button
                type="button"
                onClick={() => { setShowAdd(false); setFormError(null); }}
                className="px-5 py-2 rounded-xl font-bold bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      {editingItem && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">{t("admin.editService")}</h3>
          <form onSubmit={handleEdit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {t("admin.serviceName")}
              </label>
              <input
                name="editName"
                type="text"
                defaultValue={editingItem.name}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {t("admin.priceDisplayed")}
              </label>
              <input
                name="editPrice"
                type="text"
                defaultValue={editingItem.price}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                {t("admin.save")}
              </button>
              <button
                type="button"
                onClick={() => { setEditingItem(null); setFormError(null); }}
                className="px-5 py-2 rounded-xl font-bold bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-700">
            {t("admin.servicesListFor")}: {t(TABS.find((tab) => tab.id === activeTab)!.labelKey)}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
            <CheckCircle2 size={14} className="text-green-500" /> Auto-update activ
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Se încarcă…</div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="md:hidden space-y-4 p-4">
              {items.map((s) => (
                <div
                  key={s.id}
                  className="p-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-bold text-slate-900">{s.name}</span>
                    <span className="shrink-0 inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-black text-sm">
                      {s.price}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(s);
                        setShowAdd(false);
                        setFormError(null);
                      }}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
                      title={t("admin.edit")}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-slate-200"
                      title={t("admin.delete")}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
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
                  {items.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
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
                            onClick={() => {
                              setEditingItem(s);
                              setShowAdd(false);
                              setFormError(null);
                            }}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            title={t("admin.edit")}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(s)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title={t("admin.delete")}
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
          </>
        )}
      </div>
    </div>
  );
}
