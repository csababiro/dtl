import { getNamespace } from "@/lib/i18n";
import { AdminAppointmentsList } from "../components/AdminAppointmentsList";

export default function AdminAppointmentsPage() {
  const admin = getNamespace("admin");

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{admin.appointments}</h1>
      <p className="mt-2 text-zinc-600">
        Lista cererilor de programare. Acțiuni: confirmă (setează slot), modifică slot, șterge. Click-to-call și click-to-SMS pentru contact cu clientul.
      </p>
      <AdminAppointmentsList />
    </main>
  );
}
