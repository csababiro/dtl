import { getNamespace } from "@/lib/i18n";
import { AdminDashboardStats } from "./components/AdminDashboardStats";

export default function AdminDashboardPage() {
  const admin = getNamespace("admin");

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{admin.dashboard}</h1>
      <p className="mt-2 text-zinc-600">
        Venituri și volum servicii (zilnic/săptămânal/lunar) pentru modulele active.
      </p>
      <AdminDashboardStats />
    </main>
  );
}
