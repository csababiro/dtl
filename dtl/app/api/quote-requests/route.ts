import { NextResponse } from "next/server";
import {
  getQuoteRequests,
  getQuoteRequestsStore,
  nextQuoteRequestId,
  type QuoteRequest,
} from "@/lib/quote-requests-store";

export type { QuoteRequest };

export async function GET() {
  const items = getQuoteRequests();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      carMake,
      carModel,
      carYear,
      chassis,
      description,
      photoUrl,
    } = body as Record<string, unknown>;
    const item: QuoteRequest = {
      id: nextQuoteRequestId(),
      createdAt: new Date().toISOString(),
      name: String(name ?? "").trim(),
      phone: String(phone ?? "").trim(),
      email: String(email ?? "").trim(),
      carMake: String(carMake ?? "").trim(),
      carModel: String(carModel ?? "").trim(),
      carYear: String(carYear ?? "").trim(),
      description: String(description ?? "").trim(),
      chassis: chassis != null ? String(chassis).trim() : undefined,
      photoUrl: photoUrl != null ? String(photoUrl) : undefined,
    };
    getQuoteRequestsStore().push(item);
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 }
    );
  }
}
