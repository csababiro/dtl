/**
 * i18n – Romanian (v1). Resolve from messages/ro.json.
 * Structure ready for more locales later (e.g. messages/en.json).
 */

import ro from "@/messages/ro.json";

type Messages = typeof ro;

function getNested(obj: Record<string, unknown>, key: string): string | undefined {
  const parts = key.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

/**
 * Get message by key (e.g. "nav.home", "common.submit"). Returns key if not found.
 */
export function t(key: string, locale: "ro" = "ro"): string {
  const messages = locale === "ro" ? (ro as Messages) : (ro as Messages);
  const value = getNested(messages as Record<string, unknown>, key);
  return value ?? key;
}

/** Alias for t – getMessage('ro', key) */
export function getMessage(locale: "ro", key: string): string {
  return t(key, locale);
}
