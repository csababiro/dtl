import { getBusinessSettings } from "@/lib/settings";
import { t } from "@/lib/i18n";
import { Map } from "@/components/Map";

export default async function ContactPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{t("contact.title")}</h1>
      <div className="mt-6 space-y-4">
        {settings.phone && (
          <p>
            <span className="font-medium text-zinc-800">{t("contact.phone")}:</span>{" "}
            <a href={`tel:${settings.phone.trim()}`} className="text-blue-600 hover:underline">
              {settings.phone}
            </a>
          </p>
        )}
        {settings.email && (
          <p>
            <span className="font-medium text-zinc-800">{t("contact.email")}:</span>{" "}
            <a href={`mailto:${settings.email.trim()}`} className="text-blue-600 hover:underline">
              {settings.email}
            </a>
          </p>
        )}
        {settings.address && (
          <p>
            <span className="font-medium text-zinc-800">{t("contact.address")}:</span>{" "}
            {settings.address}
          </p>
        )}
      </div>
      <div className="mt-8">
        <Map address={settings.address} className="rounded-lg min-h-[240px]" />
      </div>
    </div>
  );
}
