"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

interface GalleryWithLightboxProps {
  images: string[];
}

export function GalleryWithLightbox({ images }: GalleryWithLightboxProps) {
  const [fullscreenSrc, setFullscreenSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!fullscreenSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenSrc(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [fullscreenSrc]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setFullscreenSrc(src)}
            className="aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-shadow text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ImageWithFallback
              src={src}
              alt=""
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </button>
        ))}
      </div>

      {fullscreenSrc && (
        <button
          type="button"
          onClick={() => setFullscreenSrc(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 focus:outline-none"
          aria-label="Închide"
        >
          <span className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
            <X size={28} />
          </span>
          <img
            src={fullscreenSrc}
            alt=""
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </button>
      )}
    </>
  );
}
