import { getFeatureFlags } from "@/lib/feature-flags";
import { getBusinessSettings } from "@/lib/settings";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { WhatsAppButton } from "@/components/customer/WhatsAppButton";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const flags = await getFeatureFlags();
  const settings = await getBusinessSettings();
  return (
    <>
      <Header
        flags={flags}
        logoUrl={settings.logoUrl}
        phone={settings.phone}
        email={settings.email}
        whatsapp={settings.whatsapp}
        address={settings.address}
      />
      <main className="relative z-0">{children}</main>
      <Footer
        flags={flags}
        phone={settings.phone}
        email={settings.email}
        whatsapp={settings.whatsapp}
        address={settings.address}
        description={settings.description}
        hours={settings.hours}
      />
      {(settings.whatsapp || settings.phone) && (
        <WhatsAppButton whatsapp={settings.whatsapp || settings.phone || ""} />
      )}
    </>
  );
}
