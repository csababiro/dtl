import { t } from "@/lib/i18n";
import Map from "@/components/Map";

export default function ContactPage() {
  const address = "—"; // Mock – from settings when API exists

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-6">{t("contact.title")}</h1>
      <p className="text-gray-600 mb-4">Tel: — | Email: — (setări din Admin)</p>
      <p className="mb-2 font-medium">Adresă</p>
      <p className="text-gray-600 mb-4">{address}</p>
      <Map address={address} />
    </main>
  );
}
