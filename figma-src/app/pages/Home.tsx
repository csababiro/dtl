import React from "react";
import { Link } from "react-router";
import { Wrench, Shield, Clock, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1767681092416-bccf9410bda4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzZXJ2aWNlJTIwZ2FyYWdlJTIwbWVjaGFuaWMlMjByZXBhaXIlMjBhdXRvJTIwd29ya3Nob3B8ZW58MXx8fHwxNzcwMzEyNjIxfDA&ixlib=rb-4.1.0&q=80&w=1080"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
              Servicii auto <span className="text-blue-500 underline decoration-4 underline-offset-8">complete</span> în București
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              De la întreținere periodică la reparații complexe, suntem partenerul tău de încredere pentru siguranța la volan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/programare"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group"
              >
                Rezervă programare
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/servicii"
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
              >
                Vezi serviciile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-24 max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-xl">
            <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Ce oferim</p>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">Expertiză tehnică pentru orice marcă auto</h2>
          </div>
          <Link to="/servicii" className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            Toate serviciile <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Service General",
              desc: "Revizii, frâne, suspensie, motor și diagnoză computerizată completă.",
              icon: Wrench,
              img: "https://images.unsplash.com/photo-1767681092416-bccf9410bda4?q=80&w=1080",
            },
            {
              title: "Service Anvelope",
              desc: "Montaj, echilibrare, hotel anvelope și geometrie roți 3D.",
              icon: Shield,
              img: "https://images.unsplash.com/photo-1675034743126-0f250a5fee51?q=80&w=1080",
            },
            {
              title: "Spălătorie Auto",
              desc: "Spălare profesională, detailing interior și tratamente nanotehnologice.",
              icon: Clock,
              img: "https://images.unsplash.com/photo-1769641156628-52ed6dc1a951?q=80&w=1080",
            },
          ].map((s, i) => (
            <div key={i} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 transition-all hover:shadow-2xl hover:shadow-blue-900/5">
              <div className="h-48 overflow-hidden relative">
                <ImageWithFallback src={s.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-blue-600 p-2 rounded-lg text-white">
                  <s.icon size={24} />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{s.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{s.desc}</p>
                <Link to="/programare" className="font-bold text-blue-600 flex items-center gap-2">
                  Programează <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">De ce DTL?</p>
            <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">Pasiune pentru mecanică, respect pentru client</h2>
            <div className="space-y-8">
              {[
                { t: "Piese de origine", d: "Folosim doar piese omologate și oferim garanție extinsă pentru orice lucrare." },
                { t: "Transparență totală", d: "Primești deviz detaliat și ești consultat înainte de orice operațiune suplimentară." },
                { t: "Echipamente moderne", d: "Atelierul nostru este dotat cu cele mai noi tehnologii de diagnoză și reparație." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{item.t}</h4>
                    <p className="text-slate-600">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback src="https://images.unsplash.com/photo-1767681092416-bccf9410bda4?q=80&w=1080" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-blue-600 text-white p-10 rounded-3xl shadow-2xl hidden lg:block">
              <p className="text-5xl font-black mb-2">15+</p>
              <p className="text-lg font-bold opacity-80 uppercase tracking-widest">Ani de experiență</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map & Contact */}
      <section className="py-24 max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Unde ne găsești</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-blue-600 shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-slate-900">Adresă</h4>
                  <p className="text-slate-600">Strada Auto Nr. 1, Sector 3, București</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-blue-600 shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-slate-900">Telefon</h4>
                  <p className="text-slate-600">0712 345 678</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-blue-600 shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-slate-900">Email</h4>
                  <p className="text-slate-600">office@dtl-auto.ro</p>
                </div>
              </div>
            </div>
            <div className="mt-12 p-8 bg-blue-50 rounded-2xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2">Program de lucru</h4>
              <p className="text-blue-800/70 text-sm">
                Luni - Vineri: 08:00 - 18:00<br />
                Sâmbătă: 09:00 - 14:00<br />
                Duminică: Închis
              </p>
            </div>
          </div>
          <div className="lg:col-span-2">
             {/* Map Placeholder */}
             <div className="w-full h-full min-h-[400px] bg-slate-200 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-slate-300 animate-pulse group-hover:bg-slate-200 transition-colors flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={48} className="text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">Harta interactivă</p>
                    <p className="text-slate-400 text-sm">Google Maps integrat aici</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
