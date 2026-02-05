/**
 * Firebase – FCM for admin push notifications.
 * Backend triggers FCM when new appointment request is created; frontend subscribes and displays.
 * Initialise using env vars; do not commit secrets.
 */

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseConfig() {
  return config;
}

export function isFirebaseConfigured(): boolean {
  return !!(
    config.apiKey &&
    config.projectId &&
    config.messagingSenderId
  );
}

/**
 * Request notification permission and subscribe to FCM (when Firebase SDK is added).
 * Service worker handles push events and displays notification.
 */
export async function subscribeToPush(): Promise<void> {
  if (!isFirebaseConfigured()) return;
  // TODO: when firebase package is added – getToken(messaging, { vapidKey })
  // and send token to backend for targeting
}
