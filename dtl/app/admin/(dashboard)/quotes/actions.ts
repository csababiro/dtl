"use server";

import { revalidatePath } from "next/cache";
import { setQuoteRequestStatus } from "@/lib/quote-requests-store";

export async function markQuotePrepared(_prev: unknown, formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false };
  const updated = setQuoteRequestStatus(id, "prepared");
  if (updated) {
    revalidatePath("/admin/quotes");
    revalidatePath(`/admin/quotes/${id}`);
  }
  return { ok: !!updated };
}
