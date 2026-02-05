import { t } from "@/lib/i18n";

export default function AdminAppointmentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">{t("admin.appointments")}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Listă cereri; confirmă (setează slot), modifică, șterge; click-to-call, click-to-SMS.
      </p>
      <div className="border rounded-lg p-8 text-center text-gray-500">
        Tabel cereri – API. Ascuns sau read-only pentru Technician.
      </div>
    </div>
  );
}
