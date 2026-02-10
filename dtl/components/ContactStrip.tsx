import { Phone, Mail } from "lucide-react";
import { getMapsUrl } from "@/lib/maps";

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
        {address ? (
          <a
            href={getMapsUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-70 hover:opacity-100 hover:underline min-h-[44px] items-center flex"
          >
            {address}
          </a>
        ) : null}
      </div>
    </div>
  );
}
