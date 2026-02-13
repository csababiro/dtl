import { get, patch } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import type { QuoteRequest } from "@/lib/quote-requests-store";

export type { QuoteRequest };

export async function getQuoteRequests(): Promise<
  { data: QuoteRequest[] } | { error: ApiError }
> {
  const result = await get<{ items: QuoteRequest[] }>("/quote-requests");
  if ("error" in result) return { error: result.error };
  return { data: result.data.items };
}

export async function updateQuoteRequestStatus(
  id: string,
  status: string
): Promise<{ data: QuoteRequest } | { error: ApiError }> {
  return patch<QuoteRequest, { status: string }>(`/quote-requests/${id}`, { status });
}
