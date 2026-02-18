import { NextResponse } from "next/server";
import { getQuoteRequests, createQuoteRequest, ensureClient } from "@/lib/services";
import type { QuoteRequest } from "@/lib/quote-requests-store";
import { getAuthFromRequest } from "@/lib/auth/jwt";

export type { QuoteRequest };

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    const nameStr = String(name ?? "").trim();
    const phoneStr = String(phone ?? "").trim();
    const emailStr = String(email ?? "").trim();
    const carMakeStr = String(carMake ?? "").trim();
    const carModelStr = String(carModel ?? "").trim();
    const carYearStr = String(carYear ?? "").trim();
    const result = await createQuoteRequest({
      name: nameStr,
      phone: phoneStr,
      email: emailStr,
      carMake: carMakeStr,
      carModel: carModelStr,
      carYear: carYearStr,
      description: String(description ?? "").trim(),
      chassis: chassis != null ? String(chassis).trim() : undefined,
      photoUrl: photoUrl != null ? String(photoUrl) : undefined,
      status: "pending",
    });
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    const car = [carMakeStr, carModelStr, carYearStr].filter(Boolean).join(" ") || undefined;
    await ensureClient({ name: nameStr, email: emailStr, phone: phoneStr, car });
    return NextResponse.json(result.data, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 }
    );
  }
}
