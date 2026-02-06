import React from "react";
import { Upload, Trash2, Move, Image as ImageIcon, Grid, List, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const images = [
  { id: 1, src: "https://images.unsplash.com/photo-1767681092416-bccf9410bda4?q=80&w=300", tag: "Galerie" },
  { id: 2, src: "https://images.unsplash.com/photo-1675034743126-0f250a5fee51?q=80&w=300", tag: "Servicii" },
  { id: 3, src: "https://images.unsplash.com/photo-1769641156628-52ed6dc1a951?q=80&w=300", tag: "Galerie" },
  { id: 4, src: "https://images.unsplash.com/photo-1767681092416-bccf9410bda4?q=80&w=300", tag: "Hero" },
  { id: 5, src: "https://images.unsplash.com/photo-1675034743126-0f250a5fee51?q=80&w=300", tag: "Branding" },
  { id: 6, src: "https://images.unsplash.com/photo-1769641156628-52ed6dc1a951?q=80&w=300", tag: "Galerie" },
];

const ContentAdmin = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gestiune Conținut</h1>
          <p className="text-slate-500">Administrează imaginile din galerie și brandingul site-ului.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 p-3 rounded-xl text-slate-500 hover:text-blue-600 transition-colors">
            <List size={20} />
          </button>
          <button className="bg-white border border-slate-200 p-3 rounded-xl text-blue-600 shadow-sm">
            <Grid size={20} />
          </button>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <Upload size={20} /> Încarcă Imagini
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:border-blue-400 transition-all">
            <ImageWithFallback src={img.src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
               <div className="flex items-center justify-between gap-2">
                  <div className="bg-blue-600 px-2 py-1 rounded text-[10px] font-black text-white uppercase">{img.tag}</div>
                  <div className="flex gap-1">
                    <button className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40 transition-colors">
                      <Move size={14} />
                    </button>
                    <button className="p-1.5 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
               </div>
            </div>
            <button className="absolute top-3 right-3 p-2 bg-white/10 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
               <ExternalLink size={16} />
            </button>
          </div>
        ))}
        <div className="aspect-square border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all cursor-pointer group">
          <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
            <ImageIcon size={32} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Adaugă foto</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-8">Setări Galerie</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <div>
                    <p className="font-bold text-slate-700">Afișare Grid Automat</p>
                    <p className="text-sm text-slate-500">Aranjează pozele în mod masonry.</p>
                 </div>
                 <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                 </div>
              </div>
              <div className="flex items-center justify-between">
                 <div>
                    <p className="font-bold text-slate-700">Titlu Galerie Client</p>
                    <p className="text-sm text-slate-500">Textul afișat deasupra secțiunii foto.</p>
                 </div>
                 <button className="text-blue-600 font-bold text-sm">Editează</button>
              </div>
           </div>
           <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-600 h-fit">
                 <ImageIcon size={20} />
              </div>
              <div>
                 <h4 className="font-bold text-amber-900 text-sm mb-1">Optimizare Imagini</h4>
                 <p className="text-xs text-amber-800/70 leading-relaxed">
                   Toate imaginile încărcate sunt redimensionate automat pentru a menține viteza de încărcare a site-ului sub 1.5 secunde.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContentAdmin;
