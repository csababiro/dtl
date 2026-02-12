"use client";

import { MapPin } from "lucide-react";
import { getMapsUrl } from "@/lib/maps";

interface InteractiveMapProps {
  /** Address to show on the map (used for Embed place and fallback link) */
  address?: string | null;
  /** Google Maps Embed API key (NEXT_PUBLIC_GOOGLE_MAPS_KEY). If missing, shows placeholder with link. */
  apiKey?: string | null;
  /** Minimum height of the map container */
  className?: string;
}

const DEFAULT_HEIGHT = 400;

export function InteractiveMap({ address, apiKey, className = "" }: InteractiveMapProps) {
  const hasKey = apiKey && apiKey.trim().length > 0;
  const hasAddress = address && address.trim().length > 0;

  if (hasKey && hasAddress) {
    const embedSrc = `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey.trim())}&q=${encodeURIComponent(address.trim())}`;
    return (
      <div
        className={`w-full rounded-3xl overflow-hidden bg-slate-200 ${className}`}
        style={{ minHeight: DEFAULT_HEIGHT }}
      >
        <iframe
          title="Harta interactivă"
          src={embedSrc}
          width="100%"
          height={DEFAULT_HEIGHT}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full block"
        />
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-3xl overflow-hidden bg-slate-200 flex items-center justify-center ${className}`}
      style={{ minHeight: DEFAULT_HEIGHT }}
    >
      <div className="text-center p-8">
        <MapPin size={48} className="text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500 font-bold">Harta interactivă</p>
        <p className="text-slate-400 text-sm mt-1">
          {!hasKey
            ? "Configurează NEXT_PUBLIC_GOOGLE_MAPS_KEY pentru a afișa harta."
            : !hasAddress
              ? "Adaugă adresa în Setări pentru a afișa harta."
              : "Google Maps"}
        </p>
        {hasAddress && (
          <a
            href={getMapsUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 text-sm mt-2 hover:text-blue-600 transition-colors inline-block"
          >
            Deschide în Google Maps
          </a>
        )}
      </div>
    </div>
  );
}
