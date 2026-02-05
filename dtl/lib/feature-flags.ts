/**
 * Feature flags – fetch from API when available; default all ON until API exists.
 * Sync helpers take `flags` as first argument (no global store).
 */

export type FeatureFlags = {
  tyreModule?: boolean;
  carWashModule?: boolean;
  generalBooking?: boolean;
  tyreBooking?: boolean;
  carWashBooking?: boolean;
  partsOrdering?: boolean;
  cardInstallment?: boolean;
};

const DEFAULT_FLAGS: FeatureFlags = {
  tyreModule: true,
  carWashModule: true,
  generalBooking: true,
  tyreBooking: true,
  carWashBooking: true,
  partsOrdering: true,
  cardInstallment: true,
};

export async function getFeatureFlags(): Promise<FeatureFlags> {
  const { get } = await import("./api-client");
  const result = await get<FeatureFlags>("/settings/feature-flags");
  if ("error" in result) {
    return DEFAULT_FLAGS;
  }
  return { ...DEFAULT_FLAGS, ...result.data };
}

export function isModuleEnabled(
  flags: FeatureFlags,
  module: "tyre" | "carWash"
): boolean {
  if (module === "tyre") return flags.tyreModule !== false;
  if (module === "carWash") return flags.carWashModule !== false;
  return false;
}

export function isBookingEnabled(
  flags: FeatureFlags,
  type: "general" | "tyre" | "carWash"
): boolean {
  if (type === "general") return flags.generalBooking !== false;
  if (type === "tyre") return flags.tyreBooking !== false;
  if (type === "carWash") return flags.carWashBooking !== false;
  return false;
}

export function isCardInstallmentEnabled(flags: FeatureFlags): boolean {
  return flags.cardInstallment !== false;
}

export function isPartsOrderingEnabled(flags: FeatureFlags): boolean {
  return flags.partsOrdering !== false;
}

/** True if at least one booking type is enabled (for showing Programare link) */
export function isAnyBookingEnabled(flags: FeatureFlags): boolean {
  return (
    isBookingEnabled(flags, "general") ||
    isBookingEnabled(flags, "tyre") ||
    isBookingEnabled(flags, "carWash")
  );
}
