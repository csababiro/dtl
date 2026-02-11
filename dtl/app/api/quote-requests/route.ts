import { NextResponse } from "next/server";

export interface QuoteRequest {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  carMake: string;
  carModel: string;
  carYear: string;
  description: string;
  chassis?: string;
  photoUrl?: string;
  status?: string;
}

// In-memory store for development when no external API is set (resets on server restart)
const store: QuoteRequest[] =
  typeof globalThis !== "undefined" && (globalThis as { __quoteRequests?: QuoteRequest[] }).__quoteRequests
    ? (globalThis as { __quoteRequests: QuoteRequest[] }).__quoteRequests
    : ((globalThis as { __quoteRequests: QuoteRequest[] }).__quoteRequests = []);

function nextId(): string {
  return "qr-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
}

export async function GET() {
  return NextResponse.json({ items: [...store] });
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
      id: nextId(),
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
    store.push(item);
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 }
    );
  }
}
