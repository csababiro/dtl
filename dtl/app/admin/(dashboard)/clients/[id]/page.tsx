"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getClientById,
  getClientPlati,
  getClientCars,
} from "@/lib/api/clients";
import { getAppointments } from "@/lib/api/appointments";
import { AdminClientDetailClient } from "@/components/admin/AdminClientDetailClient";
import type { DummyClient } from "@/lib/dummy-clients";
import type { DummyAppointment } from "@/lib/dummy-appointments";
import type { ClientPlata } from "@/lib/dummy-plati";
import type { ClientCar } from "@/lib/client-cars-store";
import { t } from "@/lib/i18n";

export default function AdminClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const [client, setClient] = useState<DummyClient | null>(null);
  const [appointments, setAppointments] = useState<DummyAppointment[]>([]);
  const [plati, setPlati] = useState<ClientPlata[]>([]);
  const [cars, setCars] = useState<ClientCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    getClientById(id).then((clientResult) => {
      if (cancelled) return;
      if ("error" in clientResult || !clientResult.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const c = clientResult.data;
      setClient(c);
      const email = c.email.trim().toLowerCase();
      Promise.all([
        getClientPlati(id),
        getClientCars(id),
        getAppointments(),
      ]).then(([platiRes, carsRes, apptsRes]) => {
        if (cancelled) return;
        setPlati("data" in platiRes ? platiRes.data : []);
        setCars("data" in carsRes ? carsRes.data : []);
        const all = "data" in apptsRes ? apptsRes.data : [];
        setAppointments(all.filter((a) => a.email.trim().toLowerCase() === email));
        setLoading(false);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const refetchCars = useCallback(() => {
    if (!id) return;
    getClientCars(id).then((r) => setCars("data" in r ? r.data : []));
  }, [id]);

  if (notFound) {
    router.replace("/admin/clients");
    return null;
  }
  if (loading || !client) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft size={20} />
          Înapoi la clienți
        </Link>
        <p className="text-slate-500">{t("common.loading")}</p>
      </div>
    );
  }

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
      <AdminClientDetailClient
        client={client}
        appointments={appointments}
        plati={plati}
        cars={cars}
        onRefetchCars={refetchCars}
      />
    </div>
  );
}
