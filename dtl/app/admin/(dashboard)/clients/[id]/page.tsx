import { notFound } from "next/navigation";
import Link from "next/link";
import { getClientById } from "@/lib/dummy-clients";
import { getAppointmentsByClientEmail } from "@/lib/appointments-store";
import { getPlatiByClientId } from "@/lib/dummy-plati";
import { AdminClientDetailClient } from "@/components/AdminClientDetailClient";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminClientDetailPage({ params }: PageProps) {
  const { id } = await params;
  const client = getClientById(id);
  if (!client) notFound();

  const appointments = getAppointmentsByClientEmail(client.email);
  const plati = getPlatiByClientId(id);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
      >
        <ArrowLeft size={20} />
        Înapoi la clienți
      </Link>
      <h1 className="text-3xl font-black text-slate-900">
        Client · {client.name}
      </h1>
      <AdminClientDetailClient client={client} appointments={appointments} plati={plati} />
    </div>
  );
}
