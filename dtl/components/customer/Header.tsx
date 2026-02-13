"use client";

import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { t } from "@/lib/i18n";
import { ContactStrip } from "./ContactStrip";
import type { FeatureFlags } from "@/lib/feature-flags";
import {
  isAnyBookingEnabled,
  isRequestQuoteEnabled,
  isAuthenticationEnabled,
  isGalleryEnabled,
  isTestimonialsEnabled,
} from "@/lib/feature-flags";

interface HeaderProps {
  flags: FeatureFlags;
  logoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  address?: string | null;
}

export function Header({
  flags,
  logoUrl,
  phone,
  email,
  whatsapp,
  address,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useLayoutEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const height = headerRef.current?.getBoundingClientRect().bottom ?? 0;
    setMenuTop(height);
  }, [isOpen]);
  const showBooking = isAnyBookingEnabled(flags);
  const showQuote = isRequestQuoteEnabled(flags);
  const showAuth = isAuthenticationEnabled(flags);
  const showGallery = isGalleryEnabled(flags);
  const showTestimonials = isTestimonialsEnabled(flags);

  const navLinks: { name: string; path: string; show: boolean }[] = [
    { name: t("nav.home"), path: "/", show: true },
    { name: t("nav.servicii"), path: "/servicii", show: true },
    { name: t("nav.programare"), path: "/programare", show: showBooking },
    { name: t("nav.cereOferta"), path: "/cere-oferta", show: showQuote },
    { name: t("nav.contact"), path: "/contact", show: true },
    { name: t("nav.gallery"), path: "/galerie", show: showGallery },
    { name: t("nav.testimonials"), path: "/testimoniale", show: showTestimonials },
  ].filter((l) => l.show);

  const isActive = (path: string) => pathname === path;

  const mobileMenuContent = isOpen && menuTop > 0 && typeof document !== "undefined" && (
    createPortal(
      <>
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-[200]"
          style={{ top: menuTop }}
          aria-hidden
          onClick={closeMenu}
        />
        <div
          className="md:hidden fixed left-0 right-0 w-full bg-white border-b border-slate-200 shadow-xl z-[210] overflow-y-auto"
          style={{ top: menuTop, maxHeight: `calc(100vh - ${menuTop}px)` }}
        >
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={closeMenu}
                className={`text-lg font-medium px-4 py-3 rounded-lg ${
                  isActive(link.path)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {showAuth && (
              <Link
                href="/cont"
                onClick={closeMenu}
                className={`text-lg font-medium px-4 py-3 rounded-lg ${
                  isActive("/cont") ? "bg-blue-50 text-blue-600" : "text-slate-700"
                }`}
              >
                {t("cont.title")}
              </Link>
            )}
            {showBooking && (
              <Link
                href="/programare"
                onClick={closeMenu}
                className="bg-blue-600 text-white px-4 py-4 rounded-lg font-bold text-center"
              >
                {t("home.ctaRezerva")}
              </Link>
            )}
          </div>
        </div>
      </>,
      document.body
    )
  );

  return (
    <header ref={headerRef} className="w-full flex flex-col z-[100]">
      <ContactStrip
        phone={phone}
        email={email}
        whatsapp={whatsapp}
        address={address}
      />
      <nav className="relative bg-white border-b border-slate-200 sticky top-0 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={t("nav.home")}
                className="h-10 w-auto"
              />
            ) : (
              <>
                <span className="text-3xl font-black text-blue-700 tracking-tighter">
                  DTL
                </span>
                <span className="text-sm font-semibold text-slate-500 hidden sm:inline">
                  SERVICE AUTO
                </span>
              </>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-500"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {showAuth && (
              <Link
                href="/cont"
                className={`p-2 rounded-full border border-slate-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  isActive("/cont")
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <User size={20} />
              </Link>
            )}
            {showBooking && (
              <Link
                href="/programare"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                {t("home.ctaRezerva")}
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isOpen ? "Închide meniu" : "Deschide meniu"}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>
      {mobileMenuContent}
    </header>
  );
}
