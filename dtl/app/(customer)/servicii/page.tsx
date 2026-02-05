import { getFeatureFlags } from "@/lib/feature-flags";
import ServiceList from "@/components/ServiceList";
import { t } from "@/lib/i18n";

// Mock services until API exists
const MOCK_SERVICES = [
  { id: "1", name: "Revizie", price: "de la 200 RON", description: "Schimb ulei și filtre" },
  { id: "2", name: "Schimb frâne", price: "de la 150 RON", description: "Plațute și discuri" },
];

export default async function ServiciiPage() {
  const flags = await getFeatureFlags();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-6">{t("servicii.title")}</h1>
      <ServiceList services={MOCK_SERVICES} flags={flags} />
    </main>
  );
}
