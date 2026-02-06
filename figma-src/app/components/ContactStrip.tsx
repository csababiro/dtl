import React from "react";
import { Phone, Mail, MessageCircle } from "lucide-react";

export const ContactStrip = ({ dark = false }: { dark?: boolean }) => {
  return (
    <div className={`w-full py-2 px-4 flex flex-wrap items-center justify-between text-sm ${dark ? "bg-slate-900 text-white" : "bg-blue-600 text-white"}`}>
      <div className="flex items-center gap-6">
        <a href="tel:+40712345678" className="flex items-center gap-2 hover:underline">
          <Phone size={16} />
          <span>0712 345 678</span>
        </a>
        <a href="mailto:office@dtl-auto.ro" className="flex items-center gap-2 hover:underline">
          <Mail size={16} />
          <span>office@dtl-auto.ro</span>
        </a>
      </div>
      <div className="hidden sm:flex items-center gap-4">
        <a href="https://wa.me/40712345678" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <MessageCircle size={16} className="text-green-400" />
          <span>WhatsApp</span>
        </a>
        <span className="opacity-70">Str. Auto Nr. 1, București</span>
      </div>
    </div>
  );
};
