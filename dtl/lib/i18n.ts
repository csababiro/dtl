/**
 * i18n: Romanian v1. Externalized strings; structure allows adding locales later.
 */

import ro from "@/messages/ro.json";

export type Messages = typeof ro;

const defaultMessages: Messages = ro;

export type MessageKey = string;

/**
 * Translate a key. Uses dot notation (e.g. 'nav.home').
 * Returns the key if path not found (so missing keys are visible).
 */
export function t(key: MessageKey | string): string {
  const parts = String(key).split(".");
  let current: unknown = defaultMessages;
  for (const part of parts) {
    if (current === null || current === undefined) return String(key);
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current === "string") return current;
  return String(key);
}

/**
 * For use in client components: pass messages from server (e.g. from layout).
 */
export function createT(msgs: Messages) {
  return function (key: MessageKey | string): string {
    const parts = String(key).split(".");
    let current: unknown = msgs;
    for (const part of parts) {
      if (current === null || current === undefined) return String(key);
      current = (current as Record<string, unknown>)[part];
    }
    if (typeof current === "string") return current;
    return String(key);
  };
}

/** Get messages object (e.g. for createT in client). */
export function getMessages(): Messages {
  return defaultMessages;
}
