import { t } from "@/lib/i18n";

export default function AdminAppointmentsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{t("admin.appointments")}</h1>
      <p className="mt-2 text-sm text-zinc-600">
        {t("admin.contactCustomer")}: tel: / SMS / WhatsApp (linkuri click-to-call, fără SMS din backend).
      </p>
      <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-zinc-700">Data</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-zinc-700">Client</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-zinc-700">Tip</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-zinc-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-zinc-700">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                {t("admin.noData")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-zinc-500">
        {t("admin.confirmAppointment")}, {t("admin.modifyAppointment")}, {t("admin.deleteAppointment")}.
      </p>
    </main>
  );
}
