"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { NAME_MAX, EMAIL_MAX, PHONE_MAX, MESSAGE_MAX } from "@/lib/field-limits";

const NAME_KEY = "dtl_customer_name";
const EMAIL_KEY = "dtl_customer_email";
const PHONE_KEY = "dtl_customer_phone";
const SESSION_KEY = "dtl_customer_session";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY) !== "true") return;
    const n = sessionStorage.getItem(NAME_KEY) ?? "";
    const e = sessionStorage.getItem(EMAIL_KEY) ?? "";
    const p = sessionStorage.getItem(PHONE_KEY) ?? "";
    if (n || e || p) {
      setName(n);
      setEmail(e);
      setPhone(p);
    }
  }, []);

  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700">
          Nume Complet
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ion Popescu"
          maxLength={NAME_MAX}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.slice(0, EMAIL_MAX))}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ion@exemplu.ro"
            maxLength={EMAIL_MAX}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Telefon
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="07xx xxx xxx"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700">Mesaj</label>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Cum te putem ajuta?"
          maxLength={MESSAGE_MAX}
        />
      </div>
      <button
        type="button"
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
      >
        Trimite mesajul <Send size={20} />
      </button>
    </form>
  );
}
