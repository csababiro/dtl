import { getNamespace } from "@/lib/i18n";
import { AdminCalendarView } from "../components/AdminCalendarView";

export default function AdminCalendarPage() {
  const admin = getNamespace("admin");

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{admin.calendar}</h1>
      <p className="mt-2 text-zinc-600">
        Calendare separate pentru Service general, Anvelope, Spălătorie. Vizualizări: Zi, Săptămână (implicit), Lună. Slots din API; programări Pending / Confirmed.
      </p>
      <AdminCalendarView />
    </main>
  );
}
