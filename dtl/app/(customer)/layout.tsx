import { getFeatureFlags } from "@/lib/feature-flags";
import { getBusinessSettings } from "@/lib/settings";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type CustomerLayoutProps = { children: React.ReactNode };

export default async function CustomerLayout({ children }: CustomerLayoutProps) {
  const [flags, settings] = await Promise.all([
    getFeatureFlags(),
    getBusinessSettings(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        flags={flags}
        logoUrl={settings.logoUrl}
        phone={settings.phone}
        email={settings.email}
        whatsapp={settings.whatsapp}
      />
      <main className="flex-1">{children}</main>
      <Footer
        phone={settings.phone}
        email={settings.email}
        whatsapp={settings.whatsapp}
        address={settings.address}
      />
    </div>
  );
}
