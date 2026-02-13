import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { t } from "@/lib/i18n";

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

interface WhatsAppButtonProps {
  whatsapp: string;
}

export function WhatsAppButton({ whatsapp }: WhatsAppButtonProps) {
  const number = digitsOnly(whatsapp);
  if (!number) return null;

  return (
    <Link
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 hover:bg-[#20bd5a] hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      aria-label={t("contact.whatsapp")}
    >
      <MessageCircle size={28} strokeWidth={2} />
    </Link>
  );
}
