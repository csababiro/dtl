import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getClientById,
  getClientPlati,
  getClientCars,
} from "@/lib/api/clients";
import { getAppointments } from "@/lib/api/appointments";
import { AdminClientDetailClient } from "@/components/admin/AdminClientDetailClient";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminClientDetailPage({ params }: PageProps) {
  const { id } = await params;
  const clientResult = await getClientById(id);
  if ("error" in clientResult) notFound();
  const client = clientResult.data;

  const [platiResult, carsResult, appointmentsResult] = await Promise.all([
    getClientPlati(id),
    getClientCars(id),
    getAppointments(),
  ]);

  const plati = "data" in platiResult ? platiResult.data : [];
  const cars = "data" in carsResult ? carsResult.data : [];
  const allAppointments = "data" in appointmentsResult ? appointmentsResult.data : [];
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
