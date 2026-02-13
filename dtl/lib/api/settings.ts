import { get, put } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import type { FeatureFlags } from "@/lib/feature-flags"; // type-only to avoid circular dependency
import type { BusinessSettings } from "@/lib/settings"; // type-only to avoid circular dependency
import type { WorkingHoursSchedule } from "@/lib/working-hours";
import type { ContactSettings } from "@/lib/contact-settings";

export async function getFeatureFlags(): Promise<
  { data: FeatureFlags } | { error: ApiError }
> {
  return get<FeatureFlags>("/settings/feature-flags");
}

export async function putFeatureFlags(
  body: Partial<FeatureFlags>
): Promise<{ data: FeatureFlags } | { error: ApiError }> {
  return put<FeatureFlags, Partial<FeatureFlags>>("/settings/feature-flags", body);
}

export async function getBusinessSettings(): Promise<
  { data: BusinessSettings } | { error: ApiError }
> {
  return get<BusinessSettings>("/settings/business");
}

export async function putBusinessSettings(
  body: Partial<BusinessSettings>
): Promise<{ data: BusinessSettings } | { error: ApiError }> {
  return put<BusinessSettings, Partial<BusinessSettings>>("/settings/business", body);
}

export async function getWorkingHours(): Promise<
  { data: WorkingHoursSchedule } | { error: ApiError }
> {
  return get<WorkingHoursSchedule>("/settings/working-hours");
}

export async function putWorkingHours(
  body: WorkingHoursSchedule
): Promise<{ data: WorkingHoursSchedule } | { error: ApiError }> {
  return put<WorkingHoursSchedule, WorkingHoursSchedule>("/settings/working-hours", body);
}

export async function getContactSettings(): Promise<
  { data: ContactSettings } | { error: ApiError }
> {
  return get<ContactSettings>("/settings/contact");
}

export async function putContactSettings(
  body: Partial<ContactSettings>
): Promise<{ data: ContactSettings } | { error: ApiError }> {
  return put<ContactSettings, Partial<ContactSettings>>("/settings/contact", body);
}
