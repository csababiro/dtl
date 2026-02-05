"use client";

import { useEffect } from "react";

/**
 * Lazy registration of service worker for PWA (admin). Does not block initial load.
 */
export default function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // ignore – dev or already registered
    });
  }, []);
  return null;
}
