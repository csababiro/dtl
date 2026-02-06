import messages from "@/messages/ro.json";

type Messages = typeof messages;

export function t(key: string): string {
  const value = key
    .split(".")
    .reduce(
      (obj, k) => (obj != null && typeof obj === "object" ? (obj as Record<string, unknown>)[k] : undefined),
      messages as unknown
    );
  return typeof value === "string" ? value : key;
}

export function getMessages(): Messages {
  return messages;
}
