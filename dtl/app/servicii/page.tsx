import Link from "next/link";
import { getNamespace } from "@/lib/i18n";
import { ServiciiList } from "../components/ServiciiList";

export default function ServiciiPage() {
  const servicii = getNamespace("servicii");

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">{servicii.title}</h1>
      <p className="mt-2 text-zinc-600">{servicii.listDescription}</p>
      <ServiciiList />
      <div className="mt-6">
        <Link
          href="/programare"
          className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          {servicii.requestAppointment}
        </Link>
      </div>
    </main>
  );
}
