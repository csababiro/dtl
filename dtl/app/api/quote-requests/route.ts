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
  typeof globalThis !== "undefined" && (globalThis as unknown as { __quoteRequests?: QuoteRequest[] }).__quoteRequests
    ? (globalThis as unknown as { __quoteRequests: QuoteRequest[] }).__quoteRequests
    : ((globalThis as unknown as { __quoteRequests: QuoteRequest[] }).__quoteRequests = []);

const DUMMY_QUOTES: QuoteRequest[] = [
  {
    id: "qr-dummy-1",
    createdAt: "2025-02-01T10:00:00.000Z",
    name: "Maria Popescu",
    phone: "0722111222",
    email: "maria.popescu@email.ro",
    carMake: "VW",
    carModel: "Golf VII",
    carYear: "2019",
    description: "Aș dori o ofertă pentru revizie periodică și schimb de ulei. Mașina are ~80.000 km.",
  },
  {
    id: "qr-dummy-2",
    createdAt: "2025-02-05T14:30:00.000Z",
    name: "Ion Ionescu",
    phone: "0733222333",
    email: "ion.ionescu@email.ro",
    carMake: "Dacia",
    carModel: "Duster",
    carYear: "2021",
    description: "Caut ofertă pentru schimb complet anvelope (4 bucăți) + echilibrare.",
  },
  {
    id: "qr-dummy-3",
    createdAt: "2025-02-08T09:15:00.000Z",
    name: "Elena Marin",
    phone: "0744333444",
    email: "elena.marin@email.ro",
    carMake: "BMW",
    carModel: "320d",
    carYear: "2018",
    description: "Mașina face zgomot la frâne. Vreau ofertă pentru verificare și eventual înlocuire plăcuțe + discuri.",
  },
  {
    id: "qr-dummy-4",
    createdAt: "2025-02-10T11:00:00.000Z",
    name: "Andrei Stan",
    phone: "0755444555",
    email: "andrei.stan@email.ro",
    carMake: "Skoda",
    carModel: "Octavia",
    carYear: "2020",
    description: "Ofertă pentru detailing complet (exterior + interior) și tratament ceramic.",
  },
  {
    id: "qr-dummy-5",
    createdAt: "2025-02-12T16:45:00.000Z",
    name: "Cristina Radu",
    phone: "0766555666",
    email: "cristina.radu@email.ro",
    carMake: "Ford",
    carModel: "Focus",
    carYear: "2017",
    description: "Revizie generală, schimb filtru cabină și verificare climatizare. Mulțumesc.",
  },
  {
    id: "qr-dummy-6",
    createdAt: "2025-02-14T08:20:00.000Z",
    name: "Mihai Dobre",
    phone: "0777666777",
    email: "mihai.dobre@email.ro",
    carMake: "Renault",
    carModel: "Megane",
    carYear: "2019",
    description: "Caut ofertă pentru geometrie roți și echilibrare. Am schimbat recent cauciucurile.",
  },
];

function seedDummyIfEmpty(): void {
  if (store.length === 0) {
    store.push(...DUMMY_QUOTES);
  }
}

function nextId(): string {
  return "qr-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
}

export async function GET() {
  seedDummyIfEmpty();
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
