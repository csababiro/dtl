import React, { useState } from "react";
import { User, LogIn, UserPlus, History, CreditCard, ChevronRight, Settings, LogOut, Package, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

const Account = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight">Contul meu</h1>
          <p className="text-xl text-slate-500 mb-10 leading-relaxed">
            Creează un cont pentru a vedea istoricul programărilor, facturile tale și pentru a programa mai rapid data viitoare.
          </p>
          <div className="space-y-6 mb-10">
            {[
              "Acces la istoricul complet de reparații",
              "Facturi și plăți într-un singur loc",
              "Programări simplificate",
              "Oferte personalizate și memento-uri revizii"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="text-blue-600" size={20} />
                <span className="text-slate-700 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md bg-white p-10 rounded-3xl border border-slate-100 shadow-xl">
          <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl mb-10">
            <button className="flex-1 py-3 px-2 rounded-xl text-sm font-bold bg-white text-blue-600 shadow-sm">Autentificare</button>
            <button className="flex-1 py-3 px-2 rounded-xl text-sm font-bold text-slate-500">Înregistrare</button>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email</label>
              <input type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="ion@exemplu.ro" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex justify-between">
                <span>Parolă</span>
                <button type="button" className="text-blue-600 text-xs hover:underline">Ai uitat parola?</button>
              </label>
              <input type="password" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
            </div>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Accept să primesc oferte și noutăți pe email</span>
            </label>

            <button 
              type="button"
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              Intră în cont <LogIn size={20} />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">Nu ai încă un cont?</p>
            <button className="mt-2 font-bold text-blue-600 hover:underline">Înregistrează-te acum</button>
          </div>
        </div>
      </div>
    );
  }

  // Logged In State
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-72 shrink-0">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-6">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-black mb-4">
                IP
              </div>
              <h3 className="text-xl font-black text-slate-900">Ion Popescu</h3>
              <p className="text-sm text-slate-500">Membru din: Ianuarie 2024</p>
            </div>
            <nav className="space-y-1">
              {[
                { name: "Istoric Programări", icon: History, active: true },
                { name: "Facturi și Plăți", icon: CreditCard },
                { name: "Mașinile Mele", icon: Package },
                { name: "Setări Cont", icon: Settings },
              ].map((item, i) => (
                <button 
                  key={i} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    item.active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </button>
              ))}
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all mt-4"
              >
                <LogOut size={20} />
                <span>Ieșire</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900">Programări recente</h2>
              <button className="text-blue-600 font-bold text-sm hover:underline">Vezi toate</button>
            </div>
            <div className="space-y-4">
              {[
                { id: "P-8821", date: "15 Feb 2024", time: "10:00", type: "Service General", status: "Solicitat", color: "bg-amber-100 text-amber-700" },
                { id: "P-7612", date: "22 Ian 2024", time: "14:30", type: "Anvelope", status: "Finalizat", color: "bg-green-100 text-green-700" },
              ].map((p, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{p.type}</h4>
                      <p className="text-sm text-slate-500">{p.date} • {p.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${p.color}`}>
                      {p.status}
                    </span>
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900">Facturi recente</h2>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Nr. Factură</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Dată</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Sumă</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { nr: "FACT-2024-001", date: "22 Ian 2024", amount: "450 RON", status: "Plătit" },
                    { nr: "FACT-2023-142", date: "15 Dec 2023", amount: "1.200 RON", status: "Plătit" },
                  ].map((f, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                      <td className="px-6 py-4 font-bold text-slate-900">{f.nr}</td>
                      <td className="px-6 py-4 text-slate-500">{f.date}</td>
                      <td className="px-6 py-4 text-right font-black text-blue-600">{f.amount}</td>
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
                <button className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">Vedeți tot istoricul facturilor</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Account;
