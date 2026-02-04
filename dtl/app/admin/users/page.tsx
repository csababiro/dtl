import { getNamespace } from "@/lib/i18n";
import { AdminUsersList } from "../components/AdminUsersList";

export default function AdminUsersPage() {
  const admin = getNamespace("admin");

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{admin.users}</h1>
      <p className="mt-2 text-zinc-600">
        Staff: creare/editare Admin și Technician (Super Admin/Admin). Clienți: listă; staff poate crea conturi clienți. Fără înscriere self-service pentru admin.
      </p>
      <AdminUsersList />
    </main>
  );
}
