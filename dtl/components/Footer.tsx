import Link from "next/link";
import { t } from "@/lib/i18n";
import { ContactStrip } from "./ContactStrip";

export interface FooterProps {
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  address?: string | null;
}

export function Footer({
  phone,
  email,
  whatsapp,
  address,
}: FooterProps) {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-100 px-4 py-6">
      <div className="mx-auto max-w-4xl">
        <ContactStrip
          phone={phone}
          email={email}
          whatsapp={whatsapp}
        />
        {address && (
          <p className="mt-4 text-sm text-zinc-600">
            <span className="font-medium text-zinc-800">{t("contact.address")}:</span> {address}
          </p>
        )}
        <p className="mt-4 text-xs text-zinc-500">
          <Link href="/" className="hover:text-blue-600">
            {t("nav.home")}
          </Link>
          {" · "}
          <Link href="/servicii" className="hover:text-blue-600">
            {t("nav.servicii")}
          </Link>
          {" · "}
          <Link href="/contact" className="hover:text-blue-600">
            {t("nav.contact")}
          </Link>
        </p>
      </div>
    </footer>
  );
}
