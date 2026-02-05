import { getFeatureFlags } from "@/lib/feature-flags";
import CustomerHeader from "@/components/CustomerHeader";
import Footer from "@/components/Footer";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const flags = await getFeatureFlags();
  // Mock contact – replace with API/settings when backend exists
  const phone = "—";
  const email = "—";

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader flags={flags} phone={phone} email={email} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
