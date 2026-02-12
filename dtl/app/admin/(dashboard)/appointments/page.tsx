import { t } from "@/lib/i18n";
import { DUMMY_APPOINTMENTS } from "@/lib/dummy-appointments";
import { Phone, Mail, CheckCircle, Trash2 } from "lucide-react";
import Link from "next/link";

const TIP_LABELS: Record<string, string> = {
  general: "Service general",
  tyre: "Anvelope",
  carWash: "Spălătorie",
};

function getTipLabel(tip: string): string {
  return TIP_LABELS[tip] ?? tip;
}

export default function AdminAppointmentsPage() {
  const appointments = [...DUMMY_APPOINTMENTS].sort((a, b) => {
    const d = new Date(a.data + " " + a.ora).getTime();
    const e = new Date(b.data + " " + b.ora).getTime();
    return e - d;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {t("admin.appointments")}
          </h1>
          <p className="text-slate-500">
            Listă programări (date dummy, fără API).
          </p>
        </div>
        <Link
          href="/admin/calendar"
          className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 w-fit"
        >
          Calendar
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Client / Contact
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Dată & Oră
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Mașină / Tip
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                  {t("common.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{appt.nume}</span>
                      <div className="flex items-center gap-3 mt-1 text-slate-400">
                        <a
                          href={`tel:${appt.telefon.replace(/\s/g, "")}`}
                          title="Sună"
                          className="hover:text-blue-600 transition-colors"
                        >
                          <Phone size={14} />
                        </a>
                        {appt.email && (
                          <a
                            href={`mailto:${appt.email}`}
                            title="Email"
                            className="hover:text-blue-600 transition-colors"
                          >
                            <Mail size={14} />
                          </a>
                        )}
                        <span className="text-xs">{appt.telefon}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{appt.data}</span>
                      <span className="text-xs text-blue-600 font-bold">
                        {appt.ora}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">
                        {appt.marca} {appt.model}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-tight text-slate-400">
                        {getTipLabel(appt.tip)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        appt.status === "Confirmat"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {appt.status === "Confirmat"
                        ? t("admin.confirmed")
                        : t("admin.pending")}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Confirmă (API ulterior)"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-slate-400 hover:bg-red-50 rounded-lg transition-colors"
                        title="Șterge (API ulterior)"
                      >
                        <Trash2 size={20} className="hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
