import { t } from "@/lib/i18n";
import { DUMMY_TESTIMONIAL_ITEMS } from "@/lib/dummy-testimonials";
import { MessageCircle, Star } from "lucide-react";

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

export default function AdminTestimonialsPage() {
  const items = DUMMY_TESTIMONIAL_ITEMS;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          {t("admin.testimonialsManagement")}
        </h1>
        <p className="text-slate-500 mt-1">
          {t("admin.testimonialsManagementDesc")}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <p className="text-sm text-slate-500">
            {items.length} testimoniale (date dummy, fără API).
          </p>
        </div>
        <ul className="divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.id} className="p-6 hover:bg-slate-50/50 transition-colors">
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
                        Ascuns
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 mt-2">{item.text}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
