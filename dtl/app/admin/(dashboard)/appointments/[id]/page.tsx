"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAppointmentById } from "@/lib/api/appointments";
import { t } from "@/lib/i18n";
import { AdminAppointmentDetailClient } from "@/components/admin/AdminAppointmentDetailClient";
import type { DummyAppointment } from "@/lib/dummy-appointments";

export default function AdminAppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const [appointment, setAppointment] = useState<DummyAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    getAppointmentById(id).then((result) => {
      if (cancelled) return;
      if ("error" in result || !result.data) {
        setNotFound(true);
      } else {
        setAppointment(result.data);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (notFound) {
    router.replace("/admin/appointments");
    return null;
  }
  if (loading || !appointment) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/appointments"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft size={20} />
          Înapoi la programări
        </Link>
        <p className="text-slate-500">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/appointments"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
      >
        <ArrowLeft size={20} />
        Înapoi la programări
      </Link>
      <h1 className="text-3xl font-black text-slate-900">
        {t("admin.appointmentDetails")}
      </h1>
      <AdminAppointmentDetailClient appointment={appointment} />
    </div>
  );
}
