/**
 * Evidence of user interest in creating an account (after booking or cerere ofertă).
 * Stored in localStorage; no API yet. Used to show "create account" prompt and record response.
 */

const STORAGE_KEY = "dtl-create-account-interest";

export type InterestSource = "booking" | "quote";

export type InterestResponse = "create_account" | "later";

export interface CreateAccountInterestRecord {
  source: InterestSource;
  at: string; // ISO date
  email?: string;
  response?: InterestResponse; // set when user clicks Creează cont or Mai târziu
}

function loadRecords(): CreateAccountInterestRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is CreateAccountInterestRecord =>
        p != null &&
        typeof p === "object" &&
        "source" in p &&
        "at" in p &&
        ((p as CreateAccountInterestRecord).source === "booking" ||
          (p as CreateAccountInterestRecord).source === "quote")
    );
  } catch {
    return [];
  }
}

function saveRecords(records: CreateAccountInterestRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* ignore */
  }
}

/** Record that we showed the prompt (offer). Call when modal is shown. */
export function recordCreateAccountOffer(
  source: InterestSource,
  email?: string
): void {
  const records = loadRecords();
  records.push({
    source,
    at: new Date().toISOString(),
    email: email?.trim() || undefined,
  });
  saveRecords(records);
}

/** Record user response: create_account or later. Call when user clicks the button. */
export function recordCreateAccountResponse(
  source: InterestSource,
  response: InterestResponse,
  email?: string
): void {
  const records = loadRecords();
  const last = records[records.length - 1];
  if (last && !last.response && last.source === source) {
    last.response = response;
    if (email !== undefined) last.email = email?.trim() || undefined;
  } else {
    records.push({
      source,
      at: new Date().toISOString(),
      email: email?.trim() || undefined,
      response,
    });
  }
  saveRecords(records);
}

/** Get all interest records (e.g. for admin later). */
export function getCreateAccountInterestRecords(): CreateAccountInterestRecord[] {
  return loadRecords();
}
