"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { useGallery } from "@/lib/hooks/useGallery";
import { t } from "@/lib/i18n";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Eroare la citirea fișierului."));
    reader.readAsDataURL(file);
  });
}

export function AdminGalleryClient() {
  const { items, loading, error, refetch, addItem, removeItem } = useGallery();
  const [showAdd, setShowAdd] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemove = async (id: string) => {
    const result = await removeItem(id);
    if ("error" in result) return;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    const file = pendingFile;
    if (!file || !file.type.startsWith("image/")) {
      setAddError("Selectează o imagine (JPG, PNG, etc.).");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const result = await addItem({ imageUrl: dataUrl, title: "" });
      if ("error" in result) {
        setAddError(result.error?.message ?? "Eroare la adăugare.");
        return;
      }
      setPendingFile(null);
      setShowAdd(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setAddError("Nu s-a putut încărca imaginea.");
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          {loading ? "Se încarcă…" : `${items.length} imagini.`}
        </p>
        <button
          type="button"
          onClick={() => { setShowAdd((s) => !s); setAddError(null); setPendingFile(null); }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          {t("admin.addImage")}
        </button>
      </div>

      {showAdd && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">{t("admin.addImage")}</h3>
          <form onSubmit={handleAdd} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Imagine de pe calculator
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setPendingFile(f ?? null);
                  setAddError(null);
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-bold file:bg-blue-100 file:text-blue-700 file:cursor-pointer hover:file:bg-blue-200"
              />
              {pendingFile && (
                <p className="text-sm text-slate-500 mt-1">
                  <Upload size={14} className="inline mr-1" />
                  {pendingFile.name}
                </p>
              )}
            </div>
            {addError && <p className="text-sm text-red-600">{addError}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!pendingFile}
                className="px-5 py-2 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("admin.addImage")}
              </button>
              <button
                type="button"
                onClick={() => { setShowAdd(false); setAddError(null); setPendingFile(null); }}
                className="px-5 py-2 rounded-xl font-bold bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 group"
          >
            <div className="aspect-video relative bg-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title || "Imagine galerie"}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow"
                  aria-label={t("common.delete")}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
