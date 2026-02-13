"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { NAME_MAX, EMAIL_MAX, PHONE_MAX, MESSAGE_MAX } from "@/lib/field-limits";

const NAME_KEY = "dtl_customer_name";
const EMAIL_KEY = "dtl_customer_email";
const PHONE_KEY = "dtl_customer_phone";
const SESSION_KEY = "dtl_customer_session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+()-]{10,}$/;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({});
  const [touched, setTouched] = useState(false);

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

  function validate(): boolean {
    const next: typeof errors = {};
    const nameTrim = name.trim();
    const emailTrim = email.trim();
    const phoneTrim = phone.replace(/\s/g, "");
    const messageTrim = message.trim();

    if (!nameTrim) next.name = "Numele este obligatoriu.";
    if (!emailTrim) next.email = "Emailul este obligatoriu.";
    else if (!EMAIL_RE.test(emailTrim)) next.email = "Introdu un email valid.";
    if (!phoneTrim) next.phone = "Telefonul este obligatoriu.";
    else if (!PHONE_RE.test(phoneTrim)) next.phone = "Introdu un număr de telefon valid (min. 10 cifre).";
    if (!messageTrim) next.message = "Mesajul este obligatoriu.";

    setErrors(next);
    setTouched(true);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // TODO: submit to API
  }

  const inputError = "border-red-400 focus:ring-red-500 bg-red-50/50";

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label htmlFor="contact-name" className="text-sm font-bold text-slate-700">
          Nume Complet <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value.slice(0, NAME_MAX));
            if (touched && errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          className={`w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? inputError : ""}`}
          placeholder="Ion Popescu"
          maxLength={NAME_MAX}
          required
          aria-required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-err" : undefined}
        />
        {errors.name && (
          <p id="contact-name-err" className="text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-sm font-bold text-slate-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.slice(0, EMAIL_MAX));
              if (touched && errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className={`w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? inputError : ""}`}
            placeholder="ion@exemplu.ro"
            maxLength={EMAIL_MAX}
            required
            aria-required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "contact-email-err" : undefined}
          />
          {errors.email && (
            <p id="contact-email-err" className="text-sm text-red-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-phone" className="text-sm font-bold text-slate-700">
            Telefon <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (touched && errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
            }}
            className={`w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? inputError : ""}`}
            placeholder="07xx xxx xxx"
            maxLength={PHONE_MAX}
            required
            aria-required
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "contact-phone-err" : undefined}
          />
          {errors.phone && (
            <p id="contact-phone-err" className="text-sm text-red-600" role="alert">
              {errors.phone}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-sm font-bold text-slate-700">
          Mesaj <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value.slice(0, MESSAGE_MAX));
            if (touched && errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
          }}
          className={`w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.message ? inputError : ""}`}
          placeholder="Cum te putem ajuta?"
          maxLength={MESSAGE_MAX}
          required
          aria-required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-err" : undefined}
        />
        {errors.message && (
          <p id="contact-message-err" className="text-sm text-red-600" role="alert">
            {errors.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
      >
        Trimite mesajul <Send size={20} />
      </button>
    </form>
  );
}
