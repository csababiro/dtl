import { t } from "@/lib/i18n";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">{t("admin.users")}</h1>
      <div className="space-y-6">
        <section className="border rounded-lg p-4">
          <h2 className="font-medium mb-2">Staff (Admin, Technician)</h2>
          <p className="text-sm text-gray-500">
            Creare/editare de Super Admin sau Admin. Fără înregistrare self-service admin.
          </p>
        </section>
        <section className="border rounded-lg p-4">
          <h2 className="font-medium mb-2">Clienți</h2>
          <p className="text-sm text-gray-500">
            Listă; staff poate crea conturi clienți. Self-registration pe site-ul public.
          </p>
        </section>
      </div>
    </div>
  );
}
