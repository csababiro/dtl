import { getNamespace } from "@/lib/i18n";
import { AdminServicesCRUD } from "../components/AdminServicesCRUD";

export default function AdminServicesPage() {
  const admin = getNamespace("admin");

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{admin.services}</h1>
      <p className="mt-2 text-zinc-600">
        CRUD servicii generale, anvelope, pachete spălătorie (secțiuni separate), fiecare cu preț. Listele opționale de programare (General, Anvelope, Spălătorie) cu etichete default în română.
      </p>
      <AdminServicesCRUD />
    </main>
  );
}
