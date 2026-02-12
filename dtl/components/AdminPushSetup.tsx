"use client";

import { useEffect } from "react";
import { getFCMToken, requestNotificationPermission } from "@/lib/fcm-client";

/** Registers admin FCM token when in admin and permission granted. Runs once on mount. */
export function AdminPushSetup() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const permission = await requestNotificationPermission();
      if (cancelled || permission !== "granted") return;
      const token = await getFCMToken();
      if (cancelled || !token) return;
      try {
        await fetch("/api/push/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, role: "admin" }),
        });
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
