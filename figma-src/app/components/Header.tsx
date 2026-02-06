import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, User } from "lucide-react";
import { ContactStrip } from "./ContactStrip";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Acasă", path: "/" },
    { name: "Servicii", path: "/servicii" },
    { name: "Programare", path: "/programare" },
    { name: "Cere ofertă", path: "/cere-oferta" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full flex flex-col z-50">
      <ContactStrip />
      <nav className="bg-white border-b border-slate-200 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl font-black text-blue-700 tracking-tighter">DTL</span>
            <span className="text-sm font-semibold text-slate-500 hidden sm:inline">SERVICE AUTO</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${
                  isActive(link.path) ? "text-blue-600" : "text-slate-600 hover:text-blue-500"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/cont"
              className={`p-2 rounded-full border border-slate-200 transition-colors ${
                isActive("/cont") ? "bg-blue-50 text-blue-600 border-blue-200" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <User size={20} />
            </Link>
            <Link
              to="/programare"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Rezervă programare
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-600">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium px-4 py-2 rounded-lg ${
                    isActive(link.path) ? "bg-blue-50 text-blue-600" : "text-slate-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/cont"
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium px-4 py-2 rounded-lg ${
                  isActive("/cont") ? "bg-blue-50 text-blue-600" : "text-slate-700"
                }`}
              >
                Contul meu
              </Link>
              <Link
                to="/programare"
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-4 rounded-lg font-bold text-center"
              >
                Rezervă programare
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
