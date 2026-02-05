// Placeholder service worker – FCM push and cache can be added (e.g. Workbox)
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
