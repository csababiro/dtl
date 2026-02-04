"use client";

import { useEffect } from "react";

/**
 * Lazy service worker registration. Does not block initial render.
 * Registers only when running in browser and on admin route (PWA is for admin push).
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        console.debug("[PWA] Service worker registered", reg.scope);
      } catch (err) {
        console.warn("[PWA] Service worker registration failed", err);
      }
    };

    register();
  }, []);

  return null;
}
