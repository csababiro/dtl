"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getClientById } from "@/lib/api/clients";
import { getPlataById } from "@/lib/api/plati";
import { AdminFacturaDetailClient } from "@/components/admin/AdminFacturaDetailClient";
import type { DummyClient } from "@/lib/dummy-clients";
import type { ClientPlata } from "@/lib/dummy-plati";

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

export default function AdminFacturaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = typeof params.id === "string" ? params.id : "";
  const plataId = typeof params.plataId === "string" ? params.plataId : "";
  const [client, setClient] = useState<DummyClient | null>(null);
  const [plata, setPlata] = useState<ClientPlata | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!clientId || !plataId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    Promise.all([getClientById(clientId), getPlataById(plataId)]).then(
      ([clientRes, plataRes]) => {
        if (cancelled) return;
        if ("error" in clientRes || !clientRes.data) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        if ("error" in plataRes || !plataRes.data) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        if (plataRes.data.clientId !== clientRes.data.id) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setClient(clientRes.data);
        setPlata(plataRes.data);
        setLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [clientId, plataId]);

  const refetchPlata = () => {
    getPlataById(plataId).then((r) => {
      if ("data" in r && r.data) setPlata(r.data);
    });
  };

  if (notFound) {
    router.replace(`/admin/clients/${clientId}`);
    return null;
  }
  if (loading || !client || !plata) {
    return (
      <div className="space-y-6">
        <Link
          href={`/admin/clients/${clientId}`}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft size={20} />
          Înapoi la client
        </Link>
        <p className="text-slate-500">Se încarcă…</p>
      </div>
    );
  }

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
      <AdminFacturaDetailClient plata={plata} onRefetch={refetchPlata} />
    </div>
  );
}
