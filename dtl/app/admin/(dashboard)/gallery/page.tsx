import { t } from "@/lib/i18n";
import { DUMMY_GALLERY_ITEMS } from "@/lib/dummy-gallery";

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

export default function AdminGalleryPage() {
  const items = DUMMY_GALLERY_ITEMS;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          {t("admin.galleryManagement")}
        </h1>
        <p className="text-slate-500 mt-1">
          {t("admin.galleryManagementDesc")}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <p className="text-sm text-slate-500">
            {items.length} imagini (date dummy, fără API).
          </p>
        </div>
        <div className="p-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50"
              >
                <div className="aspect-video relative bg-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  {item.caption && (
                    <p className="text-sm text-slate-500 mt-1">{item.caption}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    {formatDate(item.createdAt)} · #{item.order}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
