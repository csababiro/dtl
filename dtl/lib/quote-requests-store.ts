/**
 * In-memory store for quote requests (cereri ofertă).
 * Shared by API route and admin quotes page so the page can read without fetch (avoids network error).
 */

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

const DUMMY_QUOTES: QuoteRequest[] = [
  {
    id: "qr-demo-1",
    createdAt: "2025-02-08T12:00:00.000Z",
    status: "pending",
    name: "Demo Utilizator",
    phone: "0700000000",
    email: "demo@dtl.ro",
    carMake: "Demo",
    carModel: "Mașină",
    carYear: "2024",
    description: "Cerere ofertă demo – revizie și schimb ulei.",
  },
  {
    id: "qr-demo-2",
    createdAt: "2024-12-01T09:00:00.000Z",
    status: "prepared",
    name: "Demo Utilizator",
    phone: "0700000000",
    email: "demo@dtl.ro",
    carMake: "Demo",
    carModel: "Mașină",
    carYear: "2024",
    description: "Ofertă schimb anvelope iarnă (demo).",
  },
  {
    id: "qr-dummy-1",
    createdAt: "2025-02-01T10:00:00.000Z",
    status: "pending",
    name: "Maria Popescu",
    phone: "0722111222",
    email: "maria.popescu@email.ro",
    carMake: "VW",
    carModel: "Golf VII",
    carYear: "2019",
    description: "Aș dori o ofertă pentru revizie periodică și schimb de ulei. Mașina are ~80.000 km.",
  },
  {
    id: "qr-dummy-1b",
    createdAt: "2024-11-10T14:00:00.000Z",
    status: "prepared",
    name: "Maria Popescu",
    phone: "0722111222",
    email: "maria.popescu@email.ro",
    carMake: "VW",
    carModel: "Golf VII",
    carYear: "2019",
    description: "Ofertă pentru schimb anvelope iarnă (4 bucăți) și echilibrare.",
  },
  {
    id: "qr-dummy-2",
    createdAt: "2025-02-05T14:30:00.000Z",
    status: "pending",
    name: "Ion Ionescu",
    phone: "0733222333",
    email: "ion.ionescu@email.ro",
    carMake: "Dacia",
    carModel: "Duster",
    carYear: "2021",
    description: "Caut ofertă pentru schimb complet anvelope (4 bucăți) + echilibrare.",
  },
  {
    id: "qr-dummy-2b",
    createdAt: "2024-12-01T09:00:00.000Z",
    status: "prepared",
    name: "Ion Ionescu",
    phone: "0733222333",
    email: "ion.ionescu@email.ro",
    carMake: "Dacia",
    carModel: "Duster",
    carYear: "2021",
    description: "Ofertă pentru revizie și verificare frâne.",
  },
  {
    id: "qr-dummy-3",
    createdAt: "2025-02-08T09:15:00.000Z",
    status: "pending",
    name: "Elena Marin",
    phone: "0744333444",
    email: "elena.marin@email.ro",
    carMake: "BMW",
    carModel: "320d",
    carYear: "2018",
    description: "Mașina face zgomot la frâne. Vreau ofertă pentru verificare și eventual înlocuire plăcuțe + discuri.",
  },
  {
    id: "qr-dummy-3b",
    createdAt: "2024-12-20T11:30:00.000Z",
    status: "prepared",
    name: "Elena Marin",
    phone: "0744333444",
    email: "elena.marin@email.ro",
    carMake: "BMW",
    carModel: "320d",
    carYear: "2018",
    description: "Ofertă schimb anvelope + echilibrare.",
  },
  {
    id: "qr-dummy-4",
    createdAt: "2025-02-10T11:00:00.000Z",
    status: "pending",
    name: "Andrei Stan",
    phone: "0755444555",
    email: "andrei.stan@email.ro",
    carMake: "Skoda",
    carModel: "Octavia",
    carYear: "2020",
    description: "Ofertă pentru detailing complet (exterior + interior) și tratament ceramic.",
  },
  {
    id: "qr-dummy-4b",
    createdAt: "2025-01-05T16:00:00.000Z",
    status: "prepared",
    name: "Andrei Stan",
    phone: "0755444555",
    email: "andrei.stan@email.ro",
    carMake: "Skoda",
    carModel: "Octavia",
    carYear: "2020",
    description: "Ofertă înlocuire plăcuțe frâne spate.",
  },
  {
    id: "qr-dummy-5",
    createdAt: "2025-02-12T16:45:00.000Z",
    status: "pending",
    name: "Cristina Radu",
    phone: "0766555666",
    email: "cristina.radu@email.ro",
    carMake: "Ford",
    carModel: "Focus",
    carYear: "2017",
    description: "Revizie generală, schimb filtru cabină și verificare climatizare. Mulțumesc.",
  },
  {
    id: "qr-dummy-5b",
    createdAt: "2024-11-25T10:15:00.000Z",
    status: "prepared",
    name: "Cristina Radu",
    phone: "0766555666",
    email: "cristina.radu@email.ro",
    carMake: "Ford",
    carModel: "Focus",
    carYear: "2017",
    description: "Ofertă spălare completă și ceră.",
  },
  {
    id: "qr-dummy-6",
    createdAt: "2025-02-14T08:20:00.000Z",
    status: "pending",
    name: "Mihai Dobre",
    phone: "0777666777",
    email: "mihai.dobre@email.ro",
    carMake: "Renault",
    carModel: "Megane",
    carYear: "2019",
    description: "Caut ofertă pentru geometrie roți și echilibrare. Am schimbat recent cauciucurile.",
  },
  {
    id: "qr-dummy-6b",
    createdAt: "2024-11-18T14:00:00.000Z",
    status: "prepared",
    name: "Mihai Dobre",
    phone: "0777666777",
    email: "mihai.dobre@email.ro",
    carMake: "Renault",
    carModel: "Megane",
    carYear: "2019",
    description: "Ofertă revizie și verificare frâne.",
  },
  {
    id: "qr-dummy-7",
    createdAt: "2025-02-15T12:00:00.000Z",
    status: "pending",
    name: "Ana Popa",
    phone: "0788777888",
    email: "ana.popa@email.ro",
    carMake: "Toyota",
    carModel: "Corolla",
    carYear: "2022",
    description: "Revizie la 30.000 km. Vreau ofertă pentru schimb ulei, filtre și verificare generală.",
  },
  {
    id: "qr-dummy-7b",
    createdAt: "2024-12-10T10:30:00.000Z",
    status: "prepared",
    name: "Ana Popa",
    phone: "0788777888",
    email: "ana.popa@email.ro",
    carMake: "Toyota",
    carModel: "Corolla",
    carYear: "2022",
    description: "Ofertă spălare completă și ceră.",
  },
  {
    id: "qr-dummy-8",
    createdAt: "2025-02-16T09:30:00.000Z",
    name: "Vasile Munteanu",
    phone: "0799888999",
    email: "vasile.m@email.ro",
    carMake: "Hyundai",
    carModel: "i30",
    carYear: "2020",
    description: "Ofertă pentru montaj anvelope vara (4 bucăți) + echilibrare. Dimensiune 205/55 R16.",
  },
  {
    id: "qr-dummy-9",
    createdAt: "2025-02-17T15:45:00.000Z",
    name: "Ioana Vasilescu",
    phone: "0710999000",
    email: "ioana.v@email.ro",
    carMake: "Opel",
    carModel: "Astra",
    carYear: "2019",
    description: "Spălare auto completă (exterior + interior) și ceră. Mașina e încă sub garanție.",
  },
  {
    id: "qr-dummy-10",
    createdAt: "2025-02-18T11:15:00.000Z",
    name: "George Niculescu",
    phone: "0722000111",
    email: "george.n@email.ro",
    carMake: "Volvo",
    carModel: "V60",
    carYear: "2021",
    description: "Verificare frâne și suspensie. Auz un zgomot la viraj. Aș dori ofertă înainte de programare.",
  },
];

const store: QuoteRequest[] =
  typeof globalThis !== "undefined" && (globalThis as unknown as { __quoteRequests?: QuoteRequest[] }).__quoteRequests
    ? (globalThis as unknown as { __quoteRequests: QuoteRequest[] }).__quoteRequests
    : ((globalThis as unknown as { __quoteRequests: QuoteRequest[] }).__quoteRequests = []);

function seedDummyIfEmpty(): void {
  if (store.length === 0) {
    store.push(...DUMMY_QUOTES);
  }
}

/** Get all quote requests (seeds dummy data if empty). Use from API or server component. */
export function getQuoteRequests(): QuoteRequest[] {
  seedDummyIfEmpty();
  return [...store];
}

/** Get a single quote request by id. Returns null if not found. */
export function getQuoteRequestById(id: string): QuoteRequest | null {
  seedDummyIfEmpty();
  const item = store.find((q) => q.id === id);
  return item ?? null;
}

/** Get quote requests for a client by email. */
export function getQuoteRequestsByEmail(clientEmail: string): QuoteRequest[] {
  seedDummyIfEmpty();
  const email = clientEmail.trim().toLowerCase();
  return store.filter((q) => q.email.trim().toLowerCase() === email);
}

export function getQuoteRequestsStore(): QuoteRequest[] {
  return store;
}

export function nextQuoteRequestId(): string {
  return "qr-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
}

export function addQuoteRequest(item: Omit<QuoteRequest, "id" | "createdAt" | "status">): QuoteRequest {
  const full: QuoteRequest = {
    ...item,
    id: nextQuoteRequestId(),
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  store.push(full);
  return full;
}

/** Set status for a quote request (e.g. "pending" | "prepared"). */
export function setQuoteRequestStatus(id: string, status: string): QuoteRequest | null {
  const item = store.find((q) => q.id === id);
  if (!item) return null;
  item.status = status;
  return item;
}
