"use server";

import {
  addClientCarInDb,
  deleteClientCarFromDb,
  getCarByIdFromDb,
  updateClientCarInDb,
} from "@/lib/db/client-cars";

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
  await addClientCarInDb({ clientId, carMake, carModel, carYear, chassis: chassis || undefined });
  return { ok: true };
}

export async function updateCarAction(
  carId: string,
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const existing = await getCarByIdFromDb(carId);
  if (!existing) return { ok: false, error: "Mașina nu a fost găsită." };
  const carMake = (formData.get("carMake") as string)?.trim() ?? "";
  const carModel = (formData.get("carModel") as string)?.trim() ?? "";
  const carYear = (formData.get("carYear") as string)?.trim() ?? "";
  const chassis = (formData.get("chassis") as string)?.trim() ?? "";
  if (!carMake || !carModel || !carYear) {
    return { ok: false, error: "Marca, modelul și anul sunt obligatorii." };
  }
  await updateClientCarInDb(carId, { carMake, carModel, carYear, chassis: chassis || undefined });
  return { ok: true };
}

export async function deleteCarAction(carId: string): Promise<{ ok: boolean; error?: string }> {
  const ok = await deleteClientCarFromDb(carId);
  return ok ? { ok: true } : { ok: false, error: "Mașina nu a fost găsită." };
}
