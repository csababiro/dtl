import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { t } from "@/lib/i18n";
import { getMapsUrl } from "@/lib/maps";
import type { FeatureFlags } from "@/lib/feature-flags";
import {
  isAnyBookingEnabled,
  isRequestQuoteEnabled,
  isAuthenticationEnabled,
  isGalleryEnabled,
  isTestimonialsEnabled,
} from "@/lib/feature-flags";

interface FooterProps {
  flags: FeatureFlags;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  description?: string | null;
  hours?: Record<string, string> | null;
}

function formatHours(hours: Record<string, string> | null | undefined): string {
  if (!hours) return "";
  const lines = Object.entries(hours).map(
    ([day, h]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${h}`
  );
  return lines.join("\n");
}

export function Footer({
  flags,
  phone,
  email,
  address,
  description,
  hours,
}: FooterProps) {
  const hoursText = formatHours(hours ?? undefined);
  const showBooking = isAnyBookingEnabled(flags);
  const showQuote = isRequestQuoteEnabled(flags);
  const showGallery = isGalleryEnabled(flags);
  const showTestimonials = isTestimonialsEnabled(flags);
  const showAuth = isAuthenticationEnabled(flags);

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <span className="text-3xl font-black text-white tracking-tighter">
              DTL
            </span>
            <span className="text-sm font-semibold text-slate-500">
              SERVICE AUTO
            </span>
          </Link>
          <p className="text-slate-400 leading-relaxed">
            {description ??
              "Soluții complete pentru întreținerea și repararea autovehiculului tău. Experiență, calitate și transparență."}
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Link-uri utile</h4>
          <ul className="space-y-4">
            <li>
              <Link href="/" className="hover:text-blue-400 transition-colors">
                {t("nav.home")}
              </Link>
            </li>
            <li>
              <Link href="/servicii" className="hover:text-blue-400 transition-colors">
                {t("nav.servicii")}
              </Link>
            </li>
            {showBooking && (
              <li>
                <Link href="/programare" className="hover:text-blue-400 transition-colors">
                  {t("nav.programare")}
                </Link>
              </li>
            )}
            {showQuote && (
              <li>
                <Link href="/cere-oferta" className="hover:text-blue-400 transition-colors">
                  {t("nav.cereOferta")}
                </Link>
              </li>
            )}
            <li>
              <Link href="/contact" className="hover:text-blue-400 transition-colors">
                {t("nav.contact")}
              </Link>
            </li>
            {showGallery && (
              <li>
                <Link href="/galerie" className="hover:text-blue-400 transition-colors">
                  {t("nav.gallery")}
                </Link>
              </li>
            )}
            {showTestimonials && (
              <li>
                <Link href="/testimoniale" className="hover:text-blue-400 transition-colors">
                  {t("nav.testimonials")}
                </Link>
              </li>
            )}
            {showAuth && (
              <li>
                <Link href="/cont" className="hover:text-blue-400 transition-colors">
                  {t("cont.title")}
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">{t("contact.title")}</h4>
          <ul className="space-y-4">
            {phone && (
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-blue-400">
                  {phone}
                </a>
              </li>
            )}
            {email && (
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-blue-400">
                  {email}
                </a>
              </li>
            )}
            {address && (
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 mt-1 shrink-0" />
                <a
                  href={getMapsUrl(address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  {address}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Program</h4>
          {hoursText ? (
            <p className="text-sm text-slate-500 whitespace-pre-line">
              {hoursText}
            </p>
          ) : (
            <p className="text-sm text-slate-500">
              Luni - Vineri: 08:00 - 18:00
              <br />
              Sâmbătă: 09:00 - 14:00
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
        <p>© {new Date().getFullYear()} DTL Service Auto. Toate drepturile rezervate.</p>
      </div>
    </footer>
  );
}
