"use server";

import { revalidatePath } from "next/cache";
import { updatePlataNotes } from "@/lib/services";

export async function updatePlataNotesAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  if (!id) return { ok: false };
  const result = await updatePlataNotes(id, notes);
  if ("error" in result || !result.data) return { ok: false };
  revalidatePath("/admin/clients");
  revalidatePath("/admin/clients/[id]", "page");
  revalidatePath("/admin/clients/[id]/facturi/[plataId]", "page");
  return { ok: true };
}
