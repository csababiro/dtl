import { NextResponse } from "next/server";
import { getQuoteRequestsFromDb, createQuoteRequestInDb } from "@/lib/db/quote-requests";
import type { QuoteRequest } from "@/lib/quote-requests-store";

export type { QuoteRequest };

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getQuoteRequestsFromDb();
  return NextResponse.json({ items });
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
    const item = await createQuoteRequestInDb({
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
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 }
    );
  }
}
