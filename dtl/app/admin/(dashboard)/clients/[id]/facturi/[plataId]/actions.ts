"use server";

import { revalidatePath } from "next/cache";
import { updatePlataNotesInDb } from "@/lib/db/plati";

export async function updatePlataNotesAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  if (!id) return { ok: false };
  const updated = await updatePlataNotesInDb(id, notes);
  if (!updated) return { ok: false };
  revalidatePath("/admin/clients");
  revalidatePath("/admin/clients/[id]", "page");
  revalidatePath("/admin/clients/[id]/facturi/[plataId]", "page");
  return { ok: true };
}
