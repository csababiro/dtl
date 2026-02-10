"use client";

import { useState, useEffect } from "react";
import {
  User,
  LogIn,
  History,
  CreditCard,
  ChevronRight,
  Settings,
  LogOut,
  Package,
  Clock,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { t } from "@/lib/i18n";

const STORAGE_KEY = "dtl_customer_session";

type Tab = "signIn" | "signUp";

export function ContPageClient() {
  const [tab, setTab] = useState<Tab>("signIn");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [promoConsent, setPromoConsent] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordRepeat, setRegisterPasswordRepeat] = useState("");
  const [registerPromo, setRegisterPromo] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterPasswordRepeat, setShowRegisterPasswordRepeat] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    if (stored === "true") setIsLoggedIn(true);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, "true");
    setIsLoggedIn(true);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegisterError(null);
    if (registerPassword !== registerPasswordRepeat) {
      setRegisterError(t("cont.passwordMismatch"));
      return;
    }
    if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, "true");
    setIsLoggedIn(true);
  }

  function handleLogout() {
    if (typeof window !== "undefined") sessionStorage.removeItem(STORAGE_KEY);
    setIsLoggedIn(false);
  }

  if (isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-12">
          <aside className="w-full md:w-72 shrink-0">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-6">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-black mb-4">
                  IP
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  {email || "Ion Popescu"}
                </h3>
                <p className="text-sm text-slate-500">
                  {t("cont.memberSince")}: Ianuarie 2024
                </p>
              </div>
              <nav className="space-y-1">
                {[
                  { name: t("cont.appointmentHistory"), icon: History, active: true },
                  { name: t("cont.invoices"), icon: CreditCard, active: false },
                  { name: t("cont.myCars"), icon: Package, active: false },
                  { name: t("cont.accountSettings"), icon: Settings, active: false },
                ].map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                      item.active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all mt-4"
                >
                  <LogOut size={20} />
                  <span>{t("cont.logout")}</span>
                </button>
              </nav>
            </div>
          </aside>

          <div className="flex-1 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900">
                  {t("cont.recentAppointments")}
                </h2>
                <button
                  type="button"
                  className="text-blue-600 font-bold text-sm hover:underline"
                >
                  {t("cont.viewAll")}
                </button>
              </div>
              <div className="space-y-4">
                {[
                  {
                    id: "P-8821",
                    date: "15 Feb 2024",
                    time: "10:00",
                    type: "Service General",
                    status: t("cont.requested"),
                    color: "bg-amber-100 text-amber-700",
                  },
                  {
                    id: "P-7612",
                    date: "22 Ian 2024",
                    time: "14:30",
                    type: "Anvelope",
                    status: t("cont.completed"),
                    color: "bg-green-100 text-green-700",
                  },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{p.type}</h4>
                        <p className="text-sm text-slate-500">
                          {p.date} • {p.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${p.color}`}
                      >
                        {p.status}
                      </span>
                      <button
                        type="button"
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6">
                {t("cont.recentInvoices")}
              </h2>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                        Nr. Factură
                      </th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                        Dată
                      </th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                        Sumă
                      </th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      {
                        nr: "FACT-2024-001",
                        date: "22 Ian 2024",
                        amount: "450 RON",
                        status: "Plătit",
                      },
                      {
                        nr: "FACT-2023-142",
                        date: "15 Dec 2023",
                        amount: "1.200 RON",
                        status: "Plătit",
                      },
                    ].map((f, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {f.nr}
                        </td>
                        <td className="px-6 py-4 text-slate-500">{f.date}</td>
                        <td className="px-6 py-4 text-right font-black text-blue-600">
                          {f.amount}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-green-600 font-bold text-sm">
                            <CheckCircle size={14} /> {f.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {t("cont.viewAllInvoices")}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  const benefits = [
    t("cont.benefitRepairs"),
    t("cont.benefitBooking"),
    t("cont.benefitPromo"),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col md:flex-row items-center gap-16">
      <div className="flex-1">
        <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight">
          {t("cont.title")}
        </h1>
        <p className="text-xl text-slate-500 mb-10 leading-relaxed">
          {t("cont.encourageAccount")}
        </p>
        <div className="space-y-6 mb-10">
          {benefits.map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle className="text-blue-600 shrink-0" size={20} />
              <span className="text-slate-700 font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md bg-white p-10 rounded-3xl border border-slate-100 shadow-xl">
        <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl mb-10">
          <button
            type="button"
            onClick={() => setTab("signIn")}
            className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold transition-all ${
              tab === "signIn"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t("cont.signIn")}
          </button>
          <button
            type="button"
            onClick={() => setTab("signUp")}
            className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold transition-all ${
              tab === "signUp"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t("cont.signUp")}
          </button>
        </div>

        {tab === "signIn" ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("admin.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ion@exemplu.ro"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex justify-between items-center">
                <span>{t("admin.password")}</span>
                <button
                  type="button"
                  className="text-blue-600 text-xs hover:underline"
                >
                  {t("cont.forgotPassword")}
                </button>
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={showLoginPassword ? "Ascunde parola" : "Arată parola"}
                >
                  {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={promoConsent}
                onChange={(e) => setPromoConsent(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                {t("cont.promoConsent")}
              </span>
            </label>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {t("cont.loginCta")} <LogIn size={20} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            {registerError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {registerError}
              </p>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("programare.name")}
              </label>
              <input
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Ion Popescu"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("admin.email")}
              </label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="ion@exemplu.ro"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("admin.password")}
              </label>
              <div className="relative">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={showRegisterPassword ? "Ascunde parola" : "Arată parola"}
                >
                  {showRegisterPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                {t("cont.repeatPassword")}
              </label>
              <div className="relative">
                <input
                  type={showRegisterPasswordRepeat ? "text" : "password"}
                  value={registerPasswordRepeat}
                  onChange={(e) => setRegisterPasswordRepeat(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPasswordRepeat((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={showRegisterPasswordRepeat ? "Ascunde parola" : "Arată parola"}
                >
                  {showRegisterPasswordRepeat ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={registerPromo}
                onChange={(e) => setRegisterPromo(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                {t("cont.promoConsent")}
              </span>
            </label>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {t("cont.signUp")} <User size={20} />
            </button>
          </form>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm">{t("cont.noAccountYet")}</p>
          <button
            type="button"
            onClick={() => setTab(tab === "signIn" ? "signUp" : "signIn")}
            className="mt-2 font-bold text-blue-600 hover:underline"
          >
            {t("cont.registerNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
