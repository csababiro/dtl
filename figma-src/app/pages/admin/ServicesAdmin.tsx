import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, CheckCircle2, ChevronDown } from "lucide-react";

const ServicesAdmin = () => {
  const [activeTab, setActiveTab] = useState("General");

  const serviceData = {
    General: [
      { name: "Revizie periodică", price: "450 RON", optional: false },
      { name: "Sistem frânare", price: "150 RON", optional: true },
      { name: "Diagnoză", price: "100 RON", optional: false },
    ],
    Anvelope: [
      { name: "Schimb anvelope", price: "160 RON", optional: false },
      { name: "Echilibrare", price: "60 RON", optional: true },
    ],
    Spălătorie: [
      { name: "Spălare ext+int", price: "60 RON", optional: false },
      { name: "Ceară", price: "30 RON", optional: true },
    ]
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gestiune Servicii</h1>
          <p className="text-slate-500">Adaugă, editează sau șterge serviciile oferite și prețurile acestora.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2">
          <Plus size={20} /> Adaugă Serviciu
        </button>
      </div>

      <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-2xl w-fit">
        {["General", "Anvelope", "Spălătorie"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === t ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-700"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-700">Listă servicii: {activeTab}</h3>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
            <CheckCircle2 size={14} className="text-green-500" /> Auto-update activ
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Nume Serviciu</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Preț Afișat</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Opțional Programare</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(serviceData as any)[activeTab].map((s: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-900">{s.name}</td>
                  <td className="px-8 py-5">
                    <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-black text-sm">
                      {s.price}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${s.optional ? 'bg-green-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${s.optional ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Opțiuni Listă Programare</h3>
          <p className="text-sm text-slate-500 mb-6">Aceste servicii apar ca bife opționale în formularul de programare al clientului.</p>
          <div className="space-y-3">
            {["Verificare lichid parbriz", "Verificare presiune roți", "Test baterie", "Igienizare habitaclu"].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700 text-sm">{item}</span>
                <Trash2 size={16} className="text-slate-300 hover:text-red-500 cursor-pointer transition-colors" />
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-sm hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2">
              <Plus size={16} /> Adaugă opțiune nouă
            </button>
          </div>
        </div>

        <div className="bg-blue-900 text-white p-8 rounded-3xl shadow-xl shadow-blue-900/20">
          <h3 className="text-lg font-bold mb-4">Sfat pentru prețuri</h3>
          <p className="text-blue-200 text-sm leading-relaxed mb-6">
            Prețurile afișate sunt orientative ("de la X RON"). Asigurați-vă că specificați clar pe site dacă prețul include sau nu TVA sau dacă acesta depinde de modelul mașinii.
          </p>
          <div className="p-4 bg-blue-800/50 rounded-2xl border border-blue-700/50 text-xs font-medium text-blue-100 italic">
            "Transparența prețurilor crește rata de conversie a programărilor online cu până la 35%."
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesAdmin;
