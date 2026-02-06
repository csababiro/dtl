import React from "react";
import { Link } from "react-router";
import { Wrench, Disc, Droplets, ArrowRight, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const serviceCategories = [
  {
    id: "general",
    title: "Service General",
    icon: Wrench,
    img: "https://images.unsplash.com/photo-1767681092416-bccf9410bda4?q=80&w=1080",
    items: [
      { name: "Revizie periodică (Ulei + Filtre)", price: "de la 450 RON" },
      { name: "Sistem de frânare (Plăcuțe/Discuri)", price: "de la 150 RON" },
      { name: "Diagnoză computerizată", price: "de la 100 RON" },
      { name: "Sistem de suspensie & direcție", price: "de la 200 RON" },
      { name: "Reparații motor & transmisie", price: "Deviz personalizat" },
      { name: "Încărcare freon AC", price: "de la 250 RON" },
    ]
  },
  {
    id: "anvelope",
    title: "Service Anvelope",
    icon: Disc,
    img: "https://images.unsplash.com/photo-1675034743126-0f250a5fee51?q=80&w=1080",
    items: [
      { name: "Schimb anvelope (set 4)", price: "de la 160 RON" },
      { name: "Echilibrare roți", price: "de la 60 RON" },
      { name: "Geometrie roți 3D", price: "de la 150 RON" },
      { name: "Hotel anvelope / sezon", price: "120 RON" },
      { name: "Vulcanizare rapidă", price: "de la 40 RON" },
    ]
  },
  {
    id: "spalatorie",
    title: "Spălătorie & Detailing",
    icon: Droplets,
    img: "https://images.unsplash.com/photo-1769641156628-52ed6dc1a951?q=80&w=1080",
    items: [
      { name: "Spălare exterior + interior", price: "de la 60 RON" },
      { name: "Ceară lichidă profesională", price: "30 RON" },
      { name: "Cosmetizare interior completă", price: "de la 450 RON" },
      { name: "Polisare faruri", price: "150 RON / set" },
      { name: "Curățare compartiment motor", price: "80 RON" },
    ]
  }
];

const Services = () => {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-slate-900 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Servicii Profesionale</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Oferim o gamă completă de servicii pentru mașina ta, utilizând echipamente de ultimă generație.
          </p>
        </div>
      </section>

      {/* Main List */}
      <section className="py-20 max-w-7xl mx-auto px-4 w-full">
        <div className="space-y-32">
          {serviceCategories.map((cat, idx) => (
            <div key={cat.id} id={cat.id} className={`flex flex-col lg:flex-row gap-16 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="lg:w-1/2">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
                  <ImageWithFallback src={cat.img} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-blue-900/10"></div>
                </div>
              </div>
              <div className="lg:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                    <cat.icon size={32} />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900">{cat.title}</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-12">
                  {cat.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 transition-colors shadow-sm">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                        <span className="font-semibold text-slate-700">{item.name}</span>
                      </div>
                      <span className="text-blue-600 font-black whitespace-nowrap ml-4">{item.price}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  to="/programare" 
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-center hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                >
                  Solicită programare <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-8">Nu ești sigur de ce are nevoie mașina ta?</h2>
          <p className="text-blue-100 text-xl mb-10">
            Vino pentru o diagnoză gratuită dacă alegi să efectuezi reparația în service-ul nostru.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              Contactează un consultant
            </Link>
            <a href="tel:+40712345678" className="bg-blue-700 text-white border border-blue-500 px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors">
              Sună acum: 0712 345 678
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
