/**
 * Shared service names and prices for customer Servicii page, Servicii/toate list, and admin.
 * APIs will replace this later.
 */

export type ServiceCategoryId = "general" | "anvelope" | "spalatorie";

export interface ServiceItem {
  name: string;
  price: string;
}

export interface ServiceCategory {
  id: ServiceCategoryId;
  items: ServiceItem[];
}

export const SERVICES_BY_CATEGORY: Record<ServiceCategoryId, ServiceItem[]> = {
  general: [
    { name: "Revizie periodică (Ulei + Filtre)", price: "de la 450 RON" },
    { name: "Sistem de frânare (Plăcuțe/Discuri)", price: "de la 150 RON" },
    { name: "Diagnoză computerizată", price: "de la 100 RON" },
  ],
  anvelope: [
    { name: "Schimb anvelope (set 4)", price: "de la 160 RON" },
    { name: "Echilibrare roți", price: "de la 60 RON" },
    { name: "Geometrie roți 3D", price: "de la 150 RON" },
  ],
  spalatorie: [
    { name: "Spălare exterior + interior", price: "de la 60 RON" },
    { name: "Ceară lichidă profesională", price: "30 RON" },
    { name: "Cosmetizare interior completă", price: "de la 450 RON" },
  ],
};
