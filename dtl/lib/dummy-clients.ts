/**
 * Dummy client data for admin Clienți (no API yet).
 */

export interface DummyClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  car?: string;
  programariCount: number;
  lastVisit?: string;
}

export const DUMMY_CLIENTS: DummyClient[] = [
  {
    id: "c1",
    name: "Maria Popescu",
    email: "maria.popescu@email.ro",
    phone: "0722 111 222",
    car: "VW Golf VII, 2019",
    programariCount: 5,
    lastVisit: "2025-02-12T09:00:00.000Z",
  },
  {
    id: "c2",
    name: "Ion Ionescu",
    email: "ion.ionescu@email.ro",
    phone: "0733 222 333",
    car: "Dacia Duster, 2021",
    programariCount: 3,
    lastVisit: "2025-02-12T11:30:00.000Z",
  },
  {
    id: "c3",
    name: "Elena Marin",
    email: "elena.marin@email.ro",
    phone: "0744 333 444",
    car: "BMW 320d, 2018",
    programariCount: 8,
    lastVisit: "2025-02-13T10:00:00.000Z",
  },
  {
    id: "c4",
    name: "Andrei Stan",
    email: "andrei.stan@email.ro",
    phone: "0755 444 555",
    car: "Skoda Octavia, 2020",
    programariCount: 2,
    lastVisit: "2025-02-13T14:00:00.000Z",
  },
  {
    id: "c5",
    name: "Cristina Radu",
    email: "cristina.radu@email.ro",
    phone: "0766 555 666",
    car: "Ford Focus, 2017",
    programariCount: 4,
    lastVisit: "2025-02-14T09:00:00.000Z",
  },
  {
    id: "c6",
    name: "Mihai Dobre",
    email: "mihai.dobre@email.ro",
    phone: "0777 666 777",
    car: "Renault Megane, 2019",
    programariCount: 1,
    lastVisit: "2025-02-14T15:30:00.000Z",
  },
  {
    id: "c7",
    name: "Ana Popa",
    email: "ana.popa@email.ro",
    phone: "0788 777 888",
    car: "Toyota Corolla, 2022",
    programariCount: 6,
    lastVisit: "2025-02-15T08:00:00.000Z",
  },
];

export function getClientById(id: string): DummyClient | null {
  return DUMMY_CLIENTS.find((c) => c.id === id) ?? null;
}
