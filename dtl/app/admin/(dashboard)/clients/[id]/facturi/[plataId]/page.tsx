import { notFound } from "next/navigation";
import Link from "next/link";
import { getClientByIdFromDb } from "@/lib/db/clients";
import { getPlataByIdFromDb } from "@/lib/db/plati";
import { AdminFacturaDetailClient } from "@/components/admin/AdminFacturaDetailClient";
import { updatePlataNotesAction } from "./actions";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string; plataId: string }>;
}

function formatDateOnly(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default async function AdminFacturaDetailPage({ params }: PageProps) {
  const { id: clientId, plataId } = await params;
  const client = await getClientByIdFromDb(clientId);
  if (!client) notFound();
  const plata = await getPlataByIdFromDb(plataId);
  if (!plata || plata.clientId !== client.id) notFound();

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/clients/${clientId}`}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
      >
        <ArrowLeft size={20} />
        Înapoi la {client.name}
      </Link>
      <h1 className="text-3xl font-black text-slate-900">
        Factură · {formatDateOnly(plata.data)} · {plata.suma}
      </h1>
      <AdminFacturaDetailClient plata={plata} onUpdateNotes={updatePlataNotesAction} />
    </div>
  );
}
