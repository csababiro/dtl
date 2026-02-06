import React from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react";

const Contact = () => {
  return (
    <div className="flex flex-col">
      <section className="bg-slate-900 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Contactează-ne</h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Suntem aici să te ajutăm. Alege modalitatea cea mai confortabilă pentru tine de a lua legătura cu noi.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-12">Informații de contact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              { icon: Phone, title: "Telefon", val: "0712 345 678", color: "bg-blue-100 text-blue-600" },
              { icon: MessageCircle, title: "WhatsApp", val: "Trimite mesaj", color: "bg-green-100 text-green-600" },
              { icon: Mail, title: "Email", val: "office@dtl-auto.ro", color: "bg-purple-100 text-purple-600" },
              { icon: Clock, title: "Program", val: "L-V: 08:00 - 18:00", color: "bg-amber-100 text-amber-600" },
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-6`}>
                  <item.icon size={24} />
                </div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</h4>
                <p className="text-xl font-bold text-slate-900">{item.val}</p>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 text-white">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Locația noastră</h4>
                <p className="text-slate-400 leading-relaxed">
                  Strada Auto Nr. 1, Sector 3, București<br />
                  În apropiere de complexul comercial X.
                </p>
              </div>
            </div>
            {/* Map Placeholder */}
            <div className="aspect-video w-full bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden">
                <div className="text-center opacity-50">
                  <MapPin size={32} className="mx-auto mb-2" />
                  <p className="text-sm font-bold uppercase">Harta Google Maps</p>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Trimite-ne un mesaj</h2>
          <p className="text-slate-500 mb-10">Dacă ai întrebări specifice, completează formularul de mai jos și îți vom răspunde în cel mai scurt timp.</p>
          
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nume Complet</label>
              <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ion Popescu" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email</label>
                <input type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="ion@exemplu.ro" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Telefon</label>
                <input type="tel" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="07xx xxx xxx" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Mesaj</label>
              <textarea rows={5} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Cum te putem ajuta?"></textarea>
            </div>
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
              Trimite mesajul <Send size={20} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
