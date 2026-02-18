import type { BusinessSettings } from "@/lib/settings";
import { getContactSettings } from "./contact-settings";
import { getBusinessSettings } from "./business-settings";

/**
 * Returns settings for public site display. Merges contact_settings (admin Contact panel)
 * with business_settings; contact overrides for phone, email, address, whatsapp so
 * the frontend shows what the admin set in Setări → Contact.
 */
export async function getPublicSiteSettings(): Promise<
  { data: BusinessSettings } | { error: import("./errors").ServiceError }
> {
  const contactResult = await getContactSettings();
  const businessResult = await getBusinessSettings();
  const contact = "data" in contactResult ? contactResult.data : null;
  const business = "data" in businessResult ? businessResult.data : null;

  const merged: BusinessSettings = {
    ...(business || {}),
    name: (contact?.companyName != null && contact.companyName !== "")
      ? contact.companyName
      : business?.name,
    phone: (contact?.phone != null && contact.phone !== "")
      ? contact.phone
      : business?.phone ?? "",
    email: (contact?.email != null && contact.email !== "")
      ? contact.email
      : business?.email ?? "",
    address: (contact?.address != null && contact.address !== "")
      ? contact.address
      : business?.address ?? "",
    whatsapp: (contact?.whatsapp != null && contact.whatsapp !== "")
      ? contact.whatsapp
      : (contact?.phone != null && contact.phone !== "")
        ? contact.phone
        : business?.whatsapp ?? business?.phone ?? "",
  };
  return { data: merged };
}
