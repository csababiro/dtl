import React from "react";
import { Link } from "react-router";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <span className="text-3xl font-black text-white tracking-tighter">DTL</span>
            <span className="text-sm font-semibold text-slate-500">SERVICE AUTO</span>
          </Link>
          <p className="text-slate-400 leading-relaxed">
            Soluții complete pentru întreținerea și repararea autovehiculului tău. Experiență, calitate și transparență.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Link-uri utile</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="hover:text-blue-400 transition-colors">Acasă</Link></li>
            <li><Link to="/servicii" className="hover:text-blue-400 transition-colors">Servicii</Link></li>
            <li><Link to="/programare" className="hover:text-blue-400 transition-colors">Programare</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-blue-500" />
              <span>0712 345 678</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-blue-500" />
              <span>office@dtl-auto.ro</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-500 mt-1 shrink-0" />
              <span>Strada Auto Nr. 1, Sector 3,<br />București, 031234</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Urmărește-ne</h4>
          <div className="flex items-center gap-4 mb-8">
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors">
              <Instagram size={20} />
            </a>
          </div>
          <p className="text-sm text-slate-500">
            Luni - Vineri: 08:00 - 18:00<br />
            Sâmbătă: 09:00 - 14:00
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
        <p>© {new Date().getFullYear()} DTL Service Auto. Toate drepturile rezervate.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-400">Termeni și condiții</a>
          <a href="#" className="hover:text-slate-400">Politică de confidențialitate</a>
          <a href="#" className="hover:text-slate-400">GDPR</a>
        </div>
      </div>
    </footer>
  );
};
