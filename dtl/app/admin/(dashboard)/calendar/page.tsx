import { t } from "@/lib/i18n";
import { getAppointments } from "@/lib/api/appointments";
import { AdminCalendarClient } from "@/components/AdminCalendarClient";
import { Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminCalendarPage() {
  const result = await getAppointments();
  const appointments = "data" in result ? result.data : [];
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {t("admin.calendar")}
          </h1>
          <p className="text-slate-500 mt-1">
            Calendar (react-big-calendar) – confirmă programări din Listă programări.
          </p>
        </div>
        <Link
          href="/admin/appointments"
          className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 w-fit"
        >
          Listă programări
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
            <CalendarIcon size={24} />
          </div>
          <span className="font-bold text-slate-800">Lună / Săptămână / Zi</span>
        </div>
        <AdminCalendarClient appointments={appointments} />
      </div>
    </div>
  );
}
