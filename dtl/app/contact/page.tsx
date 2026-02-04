import { getNamespace } from "@/lib/i18n";
import { ContactStrip } from "../components/ContactStrip";
import { GoogleMap } from "../components/GoogleMap";

export default function ContactPage() {
  const contact = getNamespace("contact");
  const address = "Adresa service (configurabilă din setări)";

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">{contact.title}</h1>
      <p className="mt-2 text-zinc-600">{contact.description}</p>
      <div className="mt-6">
        <ContactStrip />
      </div>
      <p className="mt-4 font-medium text-zinc-900">{address}</p>
      <div className="mt-4">
        <GoogleMap address={address} />
      </div>
    </main>
  );
}
