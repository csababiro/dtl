"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Car,
  ClipboardList,
  Upload,
  Loader2,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { t } from "@/lib/i18n";
import { post } from "@/lib/api-client";
import { ErrorToast } from "./ErrorToast";

export function CereOfertaForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const p = phone.trim();
    const em = email.trim();
    const make = carMake.trim();
    const model = carModel.trim();
    const year = carYear.trim();
    const desc = description.trim();
    if (!n || !p || !em || !make || !model || !year || !desc) {
      setErrorMessage(t("errors.validation"));
      return;
    }
    setErrorMessage(null);
    setLoading(true);
    const result = await post<unknown>("/quote-requests", {
      name: n,
      phone: p,
      email: em,
      carMake: make,
      carModel: model,
      carYear: year,
      description: desc,
    });
    setLoading(false);
    if ("error" in result) {
      setErrorMessage(result.error.message || t("errors.network"));
      return;
    }
    setSuccess(true);
    setName("");
    setPhone("");
    setEmail("");
    setCarMake("");
    setCarModel("");
    setCarYear("");
    setDescription("");
    setFile(null);
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl text-center border border-blue-100">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Cerere trimisă!
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {t("cereOferta.successMessage")}
          </p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Trimite altă cerere
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
          {t("cereOferta.title")}
        </h1>
        <p className="text-xl text-slate-500">
          Primește o ofertă personalizată pentru piese și manoperă.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage ? (
          <ErrorToast
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />
        ) : null}

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <User size={20} className="text-blue-600" /> Date personale
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.name")} *
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Popescu Ion"
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.email")} *
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: ion@exemplu.ro"
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.phone")} *
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07xx xxx xxx"
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Car size={20} className="text-blue-600" /> Detalii vehicul
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.carMake")} *
              </label>
              <div className="relative">
                <Car
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={carMake}
                  onChange={(e) => setCarMake(e.target.value)}
                  placeholder="Ex: BMW"
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.carModel")} *
              </label>
              <div className="relative">
                <Car
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  placeholder="Ex: Seria 3"
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.carYear")} *
              </label>
              <div className="relative">
                <Car
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={carYear}
                  onChange={(e) => setCarYear(e.target.value)}
                  placeholder="Ex: 2018"
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ClipboardList size={20} className="text-blue-600" /> Detalii ofertă
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.description")} *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder={t("cereOferta.descriptionPlaceholder")}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cereOferta.attachPhoto")}
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,.pdf"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
                >
                  {file ? (
                    <div className="flex items-center gap-2 text-blue-600 font-bold">
                      <CheckCircle2 size={24} />
                      <span>{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload
                        size={32}
                        className="text-slate-400 mb-2 group-hover:text-blue-500 transition-colors"
                      />
                      <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700">
                        Apasă pentru a alege un fișier
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        Imagini sau PDF (max. 5MB)
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              {t("cereOferta.submitRequest")} <ChevronRight size={24} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
