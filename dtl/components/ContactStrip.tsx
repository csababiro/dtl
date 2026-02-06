import { Phone, Mail, MessageCircle } from "lucide-react";
import { t } from "@/lib/i18n";

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

interface ContactStripProps {
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  dark?: boolean;
}

export function ContactStrip({
  phone,
  email,
  whatsapp,
  address,
  dark = false,
}: ContactStripProps) {
  return (
    <div
      className={`w-full py-2 px-4 flex flex-wrap items-center justify-between text-sm ${
        dark ? "bg-slate-900 text-white" : "bg-blue-600 text-white"
      }`}
    >
      <div className="flex items-center gap-6">
        {phone ? (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 hover:underline min-h-[44px] items-center"
          >
            <Phone size={16} />
            <span>{phone}</span>
          </a>
        ) : null}
        {email ? (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 hover:underline min-h-[44px] items-center"
          >
            <Mail size={16} />
            <span>{email}</span>
          </a>
        ) : null}
      </div>
      <div className="hidden sm:flex items-center gap-4">
        {whatsapp ? (
          <a
            href={`https://wa.me/${digitsOnly(whatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity min-h-[44px] items-center"
          >
            <MessageCircle size={16} className="text-green-400" />
            <span>WhatsApp</span>
          </a>
        ) : null}
        {address ? (
          <span className="opacity-70">{address}</span>
        ) : null}
      </div>
    </div>
  );
}
