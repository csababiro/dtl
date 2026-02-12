/**
 * After programare or cerere ofertă success: register user token (if permitted), notify admin, notify user.
 * Call from client only; does not block.
 */

import { getFCMToken, requestNotificationPermission } from "@/lib/fcm-client";

function generateRef(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function registerAndNotify(params: {
  type: "booking" | "quote";
  name: string;
  date?: string;
  time?: string;
  userTitle: string;
  userBody: string;
}): Promise<void> {
  const { type, name, date, time, userTitle, userBody } = params;
  const ref = generateRef(type === "booking" ? "booking" : "quote");
  try {
    const permission = await requestNotificationPermission();
    let token: string | null = null;
    if (permission === "granted") {
      token = await getFCMToken();
      if (token) {
        await fetch("/api/push/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, role: "user", ref }),
        });
      }
    }
    await fetch("/api/push/notify-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, name, date, time }),
    });
    if (token) {
      await fetch("/api/push/notify-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref, title: userTitle, body: userBody }),
      });
    }
  } catch {
    // ignore
  }
}

/** Call after booking form success. Notifies admin and optionally user. */
export function notifyOnBookingSuccess(data: { name: string; date: string; time: string }): void {
  registerAndNotify({
    type: "booking",
    name: data.name,
    date: data.date,
    time: data.time,
    userTitle: "Programare primită",
    userBody: "Am primit cererea ta. Vei fi contactat în curând.",
  });
}

/** Call after cerere ofertă form success. Notifies admin and optionally user. */
export function notifyOnQuoteSuccess(data: { name: string }): void {
  registerAndNotify({
    type: "quote",
    name: data.name,
    userTitle: "Cerere ofertă primită",
    userBody: "Am primit cererea ta de ofertă. Vei fi contactat în curând.",
  });
}
