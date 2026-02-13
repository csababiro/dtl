import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
} from "lucide-react";
import { ContactForm } from "@/components/customer/ContactForm";
import { getBusinessSettings } from "@/lib/settings";
import { t } from "@/lib/i18n";
import { getMapsUrl } from "@/lib/maps";
import { InteractiveMap } from "@/components/customer/InteractiveMap";

function formatHoursShort(hours: Record<string, string> | undefined): string {
  if (!hours) return "L-V: 08:00 - 18:00";
  const mon = hours.monday ?? "08:00–17:00";
  const sat = hours.saturday ?? "08:00–13:30";
  return `L-V: ${mon}, Sâm: ${sat}`;
}

export default async function ContactPage() {
  const settings = await getBusinessSettings();
  const hoursShort = formatHoursShort(settings.hours);

  const contactItems = [
    {
      icon: Phone,
      title: t("contact.phone"),
      val: settings.phone ?? "—",
      color: "bg-blue-100 text-blue-600",
      href: settings.phone ? `tel:${settings.phone}` : null,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      val: "Trimite mesaj",
      color: "bg-green-100 text-green-600",
      href: settings.whatsapp
        ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`
        : settings.phone
          ? `https://wa.me/${settings.phone.replace(/\D/g, "")}`
          : null,
    },
    {
      icon: Mail,
      title: t("contact.email"),
      val: settings.email || "—",
      color: "bg-purple-100 text-purple-600",
      href: settings.email ? `mailto:${settings.email}` : null,
    },
    {
      icon: Clock,
      title: "Program",
      val: hoursShort,
      color: "bg-amber-100 text-amber-600",
      href: null,
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="bg-slate-900 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            {t("contact.title")}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Suntem aici să te ajutăm. Alege modalitatea cea mai confortabilă de a
            lua legătura cu noi.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-12">
            Informații de contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {contactItems.map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-6`}
                >
                  <item.icon size={24} />
                </div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {item.title}
                </h4>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-xl font-bold text-slate-900 hover:text-blue-600"
                  >
                    {item.val}
                  </a>
                ) : (
                  <p className="text-xl font-bold text-slate-900">{item.val}</p>
                )}
              </div>
            ))}
          </div>
          <div className="p-8 rounded-3xl bg-slate-900 text-white">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Locația noastră</h4>
                {settings.address ? (
                  <a
                    href={getMapsUrl(settings.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 leading-relaxed hover:text-white transition-colors"
                  >
                    {settings.address}
                  </a>
                ) : (
                  <p className="text-slate-400 leading-relaxed">—</p>
                )}
              </div>
            </div>
            <InteractiveMap
              address={settings.address}
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}
              className="aspect-video min-h-[280px]"
            />
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Trimite-ne un mesaj
          </h2>
          <p className="text-slate-500 mb-10">
            Dacă ai întrebări specifice, completează formularul de mai jos și îți
            vom răspunde în cel mai scurt timp.
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
