"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getGalleryItems, addGalleryItem, removeGalleryItem } from "@/lib/gallery-store";
import type { GalleryItem } from "@/lib/dummy-gallery";
import { t } from "@/lib/i18n";

const DEFAULT_PLACEHOLDER = "https://placehold.co/800x500/e2e8f0/64748b?text=Imagine";

export function AdminGalleryClient() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    setItems(getGalleryItems());
  }, []);

  const handleRemove = (id: string) => {
    if (typeof window === "undefined") return;
    removeGalleryItem(id);
    setItems(getGalleryItems());
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim() || "Imagine nouă";
    const imageUrl = newImageUrl.trim() || DEFAULT_PLACEHOLDER.replace("text=Imagine", "text=" + encodeURIComponent(title));
    addGalleryItem({
      title,
      caption: newCaption.trim() || undefined,
      imageUrl,
    });
    setItems(getGalleryItems());
    setNewTitle("");
    setNewCaption("");
    setNewImageUrl("");
    setShowAdd(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          {items.length} imagini (salvate local, fără API).
        </p>
        <button
          type="button"
          onClick={() => setShowAdd((s) => !s)}
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
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {t("admin.imageTitle")}
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="ex. Service interior"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {t("admin.imageCaption")}
              </label>
              <input
                type="text"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Opțional"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {t("admin.imageUrl")}
              </label>
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Lasă gol pentru placeholder"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                {t("admin.addImage")}
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
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
                alt={item.title}
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
