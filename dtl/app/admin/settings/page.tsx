import { AdminSettingsForm } from "../components/AdminSettingsForm";

export default function AdminSettingsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Setări business</h1>
      <p className="mt-2 text-zinc-600">
        Contact, adresă, program, sărbători (RO), zile/ore suplimentare libere, durată slot per tip (implicit 1h). Card Installment: mesaj și plasare (doar reclame).
      </p>
      <AdminSettingsForm />
    </main>
  );
}
