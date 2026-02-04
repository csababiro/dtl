/**
 * Firebase Cloud Messaging (FCM) for admin push on new appointment requests.
 * Backend triggers FCM when a new request is submitted; frontend only consumes (subscribe, receive, display).
 *
 * To enable: add Firebase config (NEXT_PUBLIC_FIREBASE_*) and firebase SDK;
 * request notification permission; get FCM token and send to backend;
 * service worker (sw.js) already handles push and notification display.
 */

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

/**
 * Subscribe to FCM (call when Firebase SDK is added).
 * Token should be sent to backend so backend can trigger push on new appointment request.
 */
export async function subscribeToPush(): Promise<string | null> {
  const permission = await requestNotificationPermission();
  if (permission !== "granted") return null;
  // When Firebase is added: get FCM token and return it for backend registration
  return null;
}
