import { t } from "@/lib/i18n";

export default function AdminUsersPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{t("admin.users")}</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Staff: Super Admin, Admin, Technician. Clienți: autentificare sau creare din admin.
      </p>
      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-lg font-medium text-zinc-900">Staff</h2>
          <p className="mt-2 text-sm text-zinc-500">{t("admin.noData")}</p>
        </section>
        <section>
          <h2 className="text-lg font-medium text-zinc-900">Clienți</h2>
          <p className="mt-2 text-sm text-zinc-500">{t("admin.noData")}</p>
        </section>
      </div>
    </main>
  );
}
