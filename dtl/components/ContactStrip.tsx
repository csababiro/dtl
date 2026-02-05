"use client";

import { t } from "@/lib/i18n";

export interface ContactStripProps {
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
}

export function ContactStrip({ phone, email, whatsapp }: ContactStripProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-zinc-100 px-4 py-2 text-sm">
      {phone && (
        <a
          href={`tel:${phone.trim()}`}
          className="font-medium text-zinc-900 hover:text-blue-600 min-h-[44px] min-w-[44px] inline-flex items-center"
          aria-label={t("contact.call")}
        >
          {phone}
        </a>
      )}
      {email && (
        <a
          href={`mailto:${email.trim()}`}
          className="font-medium text-zinc-900 hover:text-blue-600 min-h-[44px] min-w-[44px] inline-flex items-center"
        >
          {email}
        </a>
      )}
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-zinc-900 hover:text-blue-600 min-h-[44px] min-w-[44px] inline-flex items-center"
          aria-label={t("contact.whatsapp")}
        >
          WhatsApp
        </a>
      )}
      {!phone && !email && !whatsapp && (
        <span className="text-zinc-500">{t("contact.phone")}: —</span>
      )}
    </div>
  );
}
