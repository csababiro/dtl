"use server";

import {
  addClientCar,
  updateClientCar,
  deleteClientCar,
  getCarById,
} from "@/lib/client-cars-store";

export async function addCarAction(
  clientId: string,
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const carMake = (formData.get("carMake") as string)?.trim() ?? "";
  const carModel = (formData.get("carModel") as string)?.trim() ?? "";
  const carYear = (formData.get("carYear") as string)?.trim() ?? "";
  const chassis = (formData.get("chassis") as string)?.trim() ?? "";
  if (!carMake || !carModel || !carYear) {
    return { ok: false, error: "Marca, modelul și anul sunt obligatorii." };
  }
  addClientCar({ clientId, carMake, carModel, carYear, chassis: chassis || undefined });
  return { ok: true };
}

export async function updateCarAction(
  carId: string,
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const existing = getCarById(carId);
  if (!existing) return { ok: false, error: "Mașina nu a fost găsită." };
  const carMake = (formData.get("carMake") as string)?.trim() ?? "";
  const carModel = (formData.get("carModel") as string)?.trim() ?? "";
  const carYear = (formData.get("carYear") as string)?.trim() ?? "";
  const chassis = (formData.get("chassis") as string)?.trim() ?? "";
  if (!carMake || !carModel || !carYear) {
    return { ok: false, error: "Marca, modelul și anul sunt obligatorii." };
  }
  updateClientCar(carId, { carMake, carModel, carYear, chassis });
  return { ok: true };
}

export async function deleteCarAction(carId: string): Promise<{ ok: boolean; error?: string }> {
  const ok = deleteClientCar(carId);
  return ok ? { ok: true } : { ok: false, error: "Mașina nu a fost găsită." };
}
