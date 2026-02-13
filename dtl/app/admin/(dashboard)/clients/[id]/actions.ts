"use server";

import {
  addClientCar,
  deleteClientCar,
  getCarById,
  updateClientCar,
} from "@/lib/services";

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
  const result = await addClientCar({ clientId, carMake, carModel, carYear, chassis: chassis || undefined });
  if ("error" in result) return { ok: false, error: result.error.message };
  return { ok: true };
}

export async function updateCarAction(
  carId: string,
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const existingResult = await getCarById(carId);
  if ("error" in existingResult || !existingResult.data)
    return { ok: false, error: "Mașina nu a fost găsită." };
  const carMake = (formData.get("carMake") as string)?.trim() ?? "";
  const carModel = (formData.get("carModel") as string)?.trim() ?? "";
  const carYear = (formData.get("carYear") as string)?.trim() ?? "";
  const chassis = (formData.get("chassis") as string)?.trim() ?? "";
  if (!carMake || !carModel || !carYear) {
    return { ok: false, error: "Marca, modelul și anul sunt obligatorii." };
  }
  const result = await updateClientCar(carId, { carMake, carModel, carYear, chassis: chassis || undefined });
  if ("error" in result) return { ok: false, error: result.error.message };
  return { ok: true };
}

export async function deleteCarAction(carId: string): Promise<{ ok: boolean; error?: string }> {
  const result = await deleteClientCar(carId);
  if ("error" in result) return { ok: false, error: result.error.message };
  return result.data ? { ok: true } : { ok: false, error: "Mașina nu a fost găsită." };
}
