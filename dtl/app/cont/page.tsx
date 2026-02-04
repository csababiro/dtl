import { getNamespace } from "@/lib/i18n";
import { ContAppointments } from "../components/ContAppointments";

export default function ContPage() {
  const cont = getNamespace("cont");

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">{cont.title}</h1>
      <p className="mt-2 text-zinc-600">{cont.description}</p>
      <ContAppointments />
    </main>
  );
}
