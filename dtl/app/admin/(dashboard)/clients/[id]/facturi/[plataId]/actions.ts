"use server";

import { revalidatePath } from "next/cache";
import { updatePlataNotes } from "@/lib/plati-store";

export async function updatePlataNotesAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  if (!id) return { ok: false };
  const updated = updatePlataNotes(id, notes);
  if (!updated) return { ok: false };
  revalidatePath("/admin/clients");
  revalidatePath("/admin/clients/[id]", "page");
  revalidatePath("/admin/clients/[id]/facturi/[plataId]", "page");
  return { ok: true };
}
