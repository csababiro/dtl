import { notFound } from "next/navigation";
import Link from "next/link";
import { get } from "@/lib/api-client";
import type { DummyClient } from "@/lib/dummy-clients";
import type { DummyAppointment } from "@/lib/dummy-appointments";
import type { ClientPlata } from "@/lib/dummy-plati";
import type { ClientCar } from "@/lib/client-cars-store";
import { AdminClientDetailClient } from "@/components/AdminClientDetailClient";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminClientDetailPage({ params }: PageProps) {
  const { id } = await params;
  const clientResult = await get<DummyClient>(`/clients/${id}`);
  if ("error" in clientResult) notFound();
  const client = clientResult.data;

  const [platiResult, carsResult, appointmentsResult] = await Promise.all([
    get<{ items: ClientPlata[] }>(`/clients/${id}/plati`),
    get<{ items: ClientCar[] }>(`/clients/${id}/cars`),
    get<{ items: DummyAppointment[] }>("/appointments"),
  ]);

  const plati = "data" in platiResult ? platiResult.data.items : [];
  const cars = "data" in carsResult ? carsResult.data.items : [];
  const allAppointments = "data" in appointmentsResult ? appointmentsResult.data.items : [];
  const email = client.email.trim().toLowerCase();
  const appointments = allAppointments.filter(
    (a) => a.email.trim().toLowerCase() === email
  );

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
      <AdminClientDetailClient client={client} appointments={appointments} plati={plati} cars={cars} />
    </div>
  );
}
