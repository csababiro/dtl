import { Phone, Mail } from "lucide-react";
import { getMapsUrl } from "@/lib/maps";

interface ContactStripProps {
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  dark?: boolean;
  /** Rendered in the center of the strip (e.g. "Vezi oferta" link) */
  centerContent?: React.ReactNode;
}

export function ContactStrip({
  phone,
  email,
  address,
  dark = false,
  centerContent,
}: ContactStripProps) {
  return (
    <div
      className={`relative w-full py-2 px-4 flex flex-wrap items-center justify-between text-sm ${
        dark ? "bg-slate-900 text-white" : "bg-blue-600 text-white"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3 sm:gap-6 min-h-[44px]">
        {phone ? (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 hover:underline"
          >
            <Phone size={16} />
            <span>{phone}</span>
          </a>
        ) : null}
        {email ? (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 hover:underline"
          >
            <Mail size={16} />
            <span>{email}</span>
          </a>
        ) : null}
      </div>
      {centerContent ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-h-[44px] flex items-center">
          {centerContent}
        </div>
      ) : null}
      <div className="hidden sm:flex items-center gap-4 min-h-[44px]">
        {address ? (
          <a
            href={getMapsUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-70 hover:opacity-100 hover:underline flex items-center"
          >
            {address}
          </a>
        ) : null}
      </div>
    </div>
  );
}
