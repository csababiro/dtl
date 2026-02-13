import type { QuoteRequest } from "@/lib/quote-requests-store";
import {
  getQuoteRequestsFromDb,
  getQuoteRequestByIdFromDb,
  createQuoteRequestInDb,
  setQuoteRequestStatusInDb,
  getQuoteRequestsByEmailFromDb,
} from "@/lib/db/quote-requests";
import { withDbErrorHandling } from "./errors";

export async function getQuoteRequests(): Promise<
  { data: QuoteRequest[] } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getQuoteRequestsFromDb());
}

export async function getQuoteRequestById(
  id: string
): Promise<
  { data: QuoteRequest | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getQuoteRequestByIdFromDb(id));
}

export async function createQuoteRequest(
  data: Omit<QuoteRequest, "id" | "createdAt">
): Promise<{ data: QuoteRequest } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => createQuoteRequestInDb(data));
}

export async function setQuoteRequestStatus(
  id: string,
  status: string
): Promise<
  { data: QuoteRequest | null } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => setQuoteRequestStatusInDb(id, status));
}

export async function getQuoteRequestsByEmail(
  clientEmail: string
): Promise<
  { data: QuoteRequest[] } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getQuoteRequestsByEmailFromDb(clientEmail));
}
