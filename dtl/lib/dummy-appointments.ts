/**
 * Dummy appointment data for admin Calendar and Programări (no API yet).
 */

export type DummyAppointmentStatus = "Confirmat" | "În așteptare";
export type DummyAppointmentType = "general" | "tyre" | "carWash";

export interface DummyAppointment {
  id: string;
  nume: string;
  telefon: string;
  email: string;
  data: string;
  ora: string;
  marca: string;
  model: string;
  tip: DummyAppointmentType;
  status: DummyAppointmentStatus;
  descriere?: string;
}

export const DUMMY_APPOINTMENTS: DummyAppointment[] = [
  {
    id: "1",
    nume: "Maria Popescu",
    telefon: "0722 111 222",
    email: "maria.popescu@email.ro",
    data: "12 Feb 2025",
    ora: "09:00",
    marca: "VW",
    model: "Golf VII",
    tip: "general",
    status: "Confirmat",
    descriere: "Revizie periodică",
  },
  {
    id: "2",
    nume: "Ion Ionescu",
    telefon: "0733 222 333",
    email: "ion.ionescu@email.ro",
    data: "12 Feb 2025",
    ora: "11:30",
    marca: "Dacia",
    model: "Duster",
    tip: "tyre",
    status: "În așteptare",
    descriere: "Schimb anvelope",
  },
  {
    id: "3",
    nume: "Elena Marin",
    telefon: "0744 333 444",
    email: "elena.marin@email.ro",
    data: "13 Feb 2025",
    ora: "10:00",
    marca: "BMW",
    model: "320d",
    tip: "general",
    status: "Confirmat",
    descriere: "Diagnoză motor",
  },
  {
    id: "4",
    nume: "Andrei Stan",
    telefon: "0755 444 555",
    email: "andrei.stan@email.ro",
    data: "13 Feb 2025",
    ora: "14:00",
    marca: "Skoda",
    model: "Octavia",
    tip: "general",
    status: "În așteptare",
    descriere: "Frâne",
  },
  {
    id: "5",
    nume: "Cristina Radu",
    telefon: "0766 555 666",
    email: "cristina.radu@email.ro",
    data: "14 Feb 2025",
    ora: "09:00",
    marca: "Ford",
    model: "Focus",
    tip: "carWash",
    status: "Confirmat",
    descriere: "Spălare exterior + interior",
  },
  {
    id: "6",
    nume: "Mihai Dobre",
    telefon: "0777 666 777",
    email: "mihai.dobre@email.ro",
    data: "14 Feb 2025",
    ora: "15:30",
    marca: "Renault",
    model: "Megane",
    tip: "tyre",
    status: "În așteptare",
    descriere: "Echilibrare roți",
  },
  {
    id: "7",
    nume: "Ana Popa",
    telefon: "0788 777 888",
    email: "ana.popa@email.ro",
    data: "15 Feb 2025",
    ora: "08:00",
    marca: "Toyota",
    model: "Corolla",
    tip: "general",
    status: "Confirmat",
    descriere: "Revizie",
  },
];
