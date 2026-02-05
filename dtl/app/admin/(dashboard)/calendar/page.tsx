import { t } from "@/lib/i18n";

export default function AdminCalendarPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">{t("admin.calendar")}</h1>
      <div className="flex gap-2 mb-4">
        <span className="px-3 py-1 bg-gray-100 rounded text-sm">Zi</span>
        <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Săptămână (implicit)</span>
        <span className="px-3 py-1 bg-gray-100 rounded text-sm">Lună</span>
      </div>
      <div className="flex gap-2 mb-4">
        <span className="text-sm text-gray-500">Calendare: General · Anvelope · Spălătorie</span>
      </div>
      <div className="border rounded-lg p-8 text-center text-gray-500 min-h-[300px]">
        Grid calendar – API sloturi; Pending / Confirmed. Technician: doar joburi alocate + Marchează lucrarea.
      </div>
    </div>
  );
}
