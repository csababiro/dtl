import { notFound } from "next/navigation";
import Link from "next/link";
import { getAppointmentById } from "@/lib/appointments-store";
import { t } from "@/lib/i18n";
import { AdminAppointmentDetailClient } from "@/components/AdminAppointmentDetailClient";
import {
  updateAppointmentTime,
  deleteAppointmentAction,
  approveAppointment,
  updateAppointmentNotesAction,
} from "../actions";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAppointmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const appointment = getAppointmentById(id);
  if (!appointment) notFound();

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
      <AdminAppointmentDetailClient
        appointment={appointment}
        onUpdateTime={updateAppointmentTime}
        onDelete={deleteAppointmentAction}
        onApprove={approveAppointment}
        onUpdateNotes={updateAppointmentNotesAction}
      />
    </div>
  );
}
