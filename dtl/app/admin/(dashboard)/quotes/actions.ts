"use server";

import { revalidatePath } from "next/cache";
import { setQuoteRequestStatusInDb } from "@/lib/db/quote-requests";

export async function markQuotePrepared(prevOrFormData: unknown, formDataArg?: FormData) {
  const formData = formDataArg ?? (prevOrFormData instanceof FormData ? prevOrFormData : null);
  if (!formData) return { ok: false };
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false };
  const updated = await setQuoteRequestStatusInDb(id, "prepared");
  if (updated) {
    revalidatePath("/admin/quotes");
    revalidatePath(`/admin/quotes/${id}`);
  }
  return { ok: !!updated };
}
