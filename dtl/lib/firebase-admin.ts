/**
 * Firebase Admin SDK for sending FCM messages. Lazy init from env.
 */

import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

let app: App | null = null;

function getAdminApp(): App {
  if (app) return app;
  const existing = getApps();
  if (existing.length > 0) {
    app = existing[0] as App;
    return app;
  }
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!json) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not set");
  }
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(json) as Record<string, unknown>;
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON");
  }
  app = initializeApp({ credential: cert(parsed) });
  return app;
}

export function getMessagingInstance() {
  return getMessaging(getAdminApp());
}
