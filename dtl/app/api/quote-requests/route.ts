import { NextResponse } from "next/server";
import { getQuoteRequests, createQuoteRequest } from "@/lib/services";
import type { QuoteRequest } from "@/lib/quote-requests-store";

export type { QuoteRequest };

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getQuoteRequests();
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ items: result.data });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
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
    } = body;
    const result = await createQuoteRequest({
      name: String(name ?? "").trim(),
      phone: String(phone ?? "").trim(),
      email: String(email ?? "").trim(),
      carMake: String(carMake ?? "").trim(),
      carModel: String(carModel ?? "").trim(),
      carYear: String(carYear ?? "").trim(),
      description: String(description ?? "").trim(),
      chassis: chassis != null ? String(chassis).trim() : undefined,
      photoUrl: photoUrl != null ? String(photoUrl) : undefined,
      status: "pending",
    });
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json(result.data, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 }
    );
  }
}
