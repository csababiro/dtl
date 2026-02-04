import { t, getNamespace } from "@/lib/i18n";
import { GoogleMap } from "./components/GoogleMap";
import { ContactStrip } from "./components/ContactStrip";
import { HomeServiceCategories } from "./components/HomeServiceCategories";

export default function HomePage() {
  const home = getNamespace("home");
  const address = "Adresa service (configurabilă din setări)";

  return (
    <main className="min-h-screen">
      <section className="bg-zinc-50 px-4 py-12">
        <h1 className="text-3xl font-bold text-zinc-900">{home.heroTitle}</h1>
        <p className="mt-2 text-lg text-zinc-600">{home.heroSubtitle}</p>
      </section>

      <section className="px-4 py-8">
        <h2 className="text-xl font-semibold text-zinc-900">{home.title}</h2>
        <HomeServiceCategories />
      </section>

      <section className="px-4 py-8">
        <h2 className="text-xl font-semibold text-zinc-900">{t("common", "contact")}</h2>
        <div className="mt-2">
          <ContactStrip />
        </div>
        <p className="mt-2 text-zinc-600">{address}</p>
        <div className="mt-4">
          <GoogleMap address={address} />
        </div>
      </section>
    </main>
  );
}
