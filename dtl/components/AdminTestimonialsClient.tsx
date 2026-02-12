"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Star, Plus, Pencil, Trash2 } from "lucide-react";
import {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  removeTestimonial,
} from "@/lib/testimonials-store";
import type { TestimonialItem } from "@/lib/dummy-testimonials";
import { t } from "@/lib/i18n";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

const emptyForm = {
  author: "",
  role: "",
  text: "",
  rating: "" as "" | "1" | "2" | "3" | "4" | "5",
  visible: true,
};

export function AdminTestimonialsClient() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setItems(getTestimonials());
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item: TestimonialItem) => {
    setEditingId(item.id);
    setForm({
      author: item.author,
      role: item.role ?? "",
      text: item.text,
      rating: item.rating != null ? String(item.rating) as "1" | "2" | "3" | "4" | "5" : "",
      visible: item.visible,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const author = form.author.trim();
    const text = form.text.trim();
    if (!author || !text) return;
    const rating = form.rating ? Number(form.rating) as number : undefined;
    const role = form.role.trim() || undefined;
    if (editingId) {
      updateTestimonial(editingId, {
        author,
        role,
        text,
        rating: rating ?? undefined,
        visible: form.visible,
      });
    } else {
      addTestimonial({
        author,
        role,
        text,
        rating: rating ?? undefined,
        visible: form.visible,
      });
    }
    setItems(getTestimonials());
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (typeof window === "undefined") return;
    removeTestimonial(id);
    setItems(getTestimonials());
    if (editingId === id) closeForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          {items.length} testimoniale (salvate local, fără API).
        </p>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          {t("admin.addTestimonial")}
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">
            {editingId ? t("admin.editTestimonial") : t("admin.addTestimonial")}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  {t("admin.testimonialAuthor")} *
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  {t("admin.testimonialRole")}
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="ex. Client"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {t("admin.testimonialText")} *
              </label>
              <textarea
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                required
              />
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  {t("admin.testimonialRating")}
                </label>
                <select
                  value={form.rating}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      rating: e.target.value as "" | "1" | "2" | "3" | "4" | "5",
                    }))
                  }
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">—</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, visible: e.target.checked }))
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  {t("admin.testimonialVisible")}
                </span>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                {editingId ? t("common.save") : t("admin.addTestimonial")}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2 rounded-xl font-bold bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="p-6 hover:bg-slate-50/50 transition-colors group rounded-xl"
          >
            <div className="flex gap-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl shrink-0 h-fit">
                <MessageCircle size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900">{item.author}</span>
                  {item.role && (
                    <span className="text-sm text-slate-500">· {item.role}</span>
                  )}
                  {item.rating != null && (
                    <span className="flex items-center gap-0.5 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      {item.rating}
                    </span>
                  )}
                  {!item.visible && (
                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                      {t("admin.testimonialHidden")}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 mt-2">{item.text}</p>
                <p className="text-xs text-slate-400 mt-2">
                  {formatDate(item.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="p-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"
                  aria-label={t("admin.editTestimonial")}
                >
                  <Pencil size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
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
