/**
 * FCM client helpers: get token and request permission. Uses dynamic import so Firebase runs only in browser.
 */

const SW_URL = "/api/push/sw";

export async function getFCMToken(): Promise<string | null> {
  if (typeof window === "undefined" || !("Notification" in window)) return null;
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) return null;
  try {
    const { getApp, getApps, initializeApp } = await import("firebase/app");
    const { getMessaging, getToken } = await import("firebase/messaging");
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    if (!config.apiKey || !config.projectId) return null;
    const app = getApps().length ? getApp() : initializeApp(config);
    const messaging = getMessaging(app);
    const registration = await navigator.serviceWorker.register(SW_URL, { scope: "/" });
    await registration.update();
    const token = await getToken(messaging, {
      serviceWorkerRegistration: registration,
      vapidKey,
    });
    return token ?? null;
  } catch {
    return null;
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const permission = await Notification.requestPermission();
  return permission;
}
