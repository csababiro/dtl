import { t } from "@/lib/i18n";

export default function AdminContentPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">{t("admin.content")}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Gestionare imagini pentru site (galerie, servicii, branding). Stocare/API TBD cu backend.
      </p>
      <div className="border rounded-lg p-8 text-center text-gray-500">
        Upload și listă imagini – după ce API este definit.
      </div>
    </div>
  );
}
