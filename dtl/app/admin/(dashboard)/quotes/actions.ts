"use server";

import { revalidatePath } from "next/cache";
import { updateQuoteRequestStatus } from "@/lib/api/quote-requests";

export async function markQuotePrepared(prevOrFormData: unknown, formDataArg?: FormData) {
  const formData = formDataArg ?? (prevOrFormData instanceof FormData ? prevOrFormData : null);
  if (!formData) return { ok: false };
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false };
  const result = await updateQuoteRequestStatus(id, "prepared");
  if ("error" in result) return { ok: false };
  if (result.data) {
    revalidatePath("/admin/quotes");
    revalidatePath(`/admin/quotes/${id}`);
  }
  return { ok: !!result.data };
}
