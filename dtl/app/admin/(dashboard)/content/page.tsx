import { t } from "@/lib/i18n";

export default function AdminContentPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{t("admin.content")}</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Gestionare imagini pentru aplicația client: galerie, servicii, branding. O singură sursă; folosite pe Acasă, Servicii, etc.
      </p>
      <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center text-zinc-500">
        {t("common.loading")}
      </div>
    </main>
  );
}
