import React from "react";
import { Save, Phone, Mail, MapPin, Clock, Shield, Globe, Camera } from "lucide-react";

const Settings = () => {
  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Setări Sistem</h1>
        <p className="text-slate-500">Configurați detaliile business-ului și parametrii de funcționare.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Globe size={20} className="text-blue-600" /> Profil Business
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nume Service</label>
                <input type="text" defaultValue="DTL Service Auto" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Logo URL</label>
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                    <Camera size={24} />
                  </div>
                  <input type="text" placeholder="https://..." className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Contact</label>
                <input type="email" defaultValue="office@dtl-auto.ro" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Telefon</label>
                <input type="tel" defaultValue="0712 345 678" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Clock size={20} className="text-blue-600" /> Parametri Programări
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Durată slot (minute)</label>
              <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                <option value="30">30 minute</option>
                <option value="60" selected>60 minute (Recomandat)</option>
                <option value="90">90 minute</option>
                <option value="120">120 minute</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Avans maxim (zile)</label>
              <input type="number" defaultValue="30" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">Ultima modificare: Astăzi la 09:45 de Admin DTL</p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 hover:bg-blue-700 transition-all">
            <Save size={18} /> Salvează Setările
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
          <Shield size={20} className="text-blue-600" /> Securitate & API
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-bold text-slate-700">Autentificare în doi pași (2FA)</p>
              <p className="text-sm text-slate-500">Mărește securitatea panoului de control.</p>
            </div>
            <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-bold text-slate-700">Cheie API Google Maps</p>
              <p className="text-sm text-slate-500">Folosită pentru harta din pagina de contact.</p>
            </div>
            <button className="text-blue-600 font-bold text-sm">Configurează</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
