import { t } from "@/lib/i18n";
import { get } from "@/lib/api-client";
import type { DummyAppointment } from "@/lib/dummy-appointments";
import { AdminAppointmentsClient } from "@/components/AdminAppointmentsClient";
import Link from "next/link";
import { approveAppointment } from "./actions";

export default async function AdminAppointmentsPage() {
  const result = await get<{ items: DummyAppointment[] }>("/appointments");
  const appointments = "data" in result ? result.data.items : [];
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {t("admin.appointments")}
          </h1>
          <p className="text-slate-500 mt-1">
            Programări viitoare și istoric. Confirmă programările din „În așteptare”.
          </p>
        </div>
        <Link
          href="/admin/calendar"
          className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 w-fit"
        >
          Calendar
        </Link>
      </div>

      <AdminAppointmentsClient
        appointments={appointments}
        referenceToday="11 Feb 2025"
        onApprove={approveAppointment}
      />
    </div>
  );
}
