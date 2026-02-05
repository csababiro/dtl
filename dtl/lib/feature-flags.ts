/**
 * Feature flags: fetched from API; default all ON when API unavailable.
 * No global store; layout/pages call getFeatureFlags() and pass result to helpers.
 */

import { get } from "./api-client";

export type ModuleFlag = "tyre" | "carWash";
export type BookingType = "general" | "tyre" | "carWash";

export interface FeatureFlags {
  tyreService?: boolean;
  carWash?: boolean;
  generalServiceBooking?: boolean;
  tyreServiceBooking?: boolean;
  carWashBooking?: boolean;
  partsOrdering?: boolean;
  cardInstallmentPayment?: boolean;
  /** Admin visibility (show to customers) - when false, feature is hidden even if enabled by Super Admin */
  tyreServiceVisible?: boolean;
  carWashVisible?: boolean;
  generalServiceBookingVisible?: boolean;
  tyreServiceBookingVisible?: boolean;
  carWashBookingVisible?: boolean;
  partsOrderingVisible?: boolean;
  cardInstallmentPaymentVisible?: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  tyreService: true,
  carWash: true,
  generalServiceBooking: true,
  tyreServiceBooking: true,
  carWashBooking: true,
  partsOrdering: true,
  cardInstallmentPayment: true,
  tyreServiceVisible: true,
  carWashVisible: true,
  generalServiceBookingVisible: true,
  tyreServiceBookingVisible: true,
  carWashBookingVisible: true,
  partsOrderingVisible: true,
  cardInstallmentPaymentVisible: true,
};

const FEATURE_FLAGS_PATH = "/settings/feature-flags";

/**
 * Fetch feature flags from API. On failure or no API, returns default (all ON).
 */
export async function getFeatureFlags(): Promise<FeatureFlags> {
  const result = await get<FeatureFlags>(FEATURE_FLAGS_PATH);
  if ("error" in result) {
    return { ...DEFAULT_FLAGS };
  }
  return { ...DEFAULT_FLAGS, ...result.data };
}

/**
 * Module (Tyre, Car Wash) is enabled by Super Admin and visible to customers.
 */
export function isModuleEnabled(
  flags: FeatureFlags,
  module: ModuleFlag
): boolean {
  if (module === "tyre") {
    return !!(flags.tyreService && flags.tyreServiceVisible !== false);
  }
  if (module === "carWash") {
    return !!(flags.carWash && flags.carWashVisible !== false);
  }
  return false;
}

/**
 * Booking for the given type is enabled and visible to customers.
 */
export function isBookingEnabled(
  flags: FeatureFlags,
  type: BookingType
): boolean {
  if (type === "general") {
    return !!(
      flags.generalServiceBooking &&
      flags.generalServiceBookingVisible !== false
    );
  }
  if (type === "tyre") {
    return !!(
      flags.tyreService &&
      flags.tyreServiceBooking &&
      flags.tyreServiceBookingVisible !== false
    );
  }
  if (type === "carWash") {
    return !!(
      flags.carWash &&
      flags.carWashBooking &&
      flags.carWashBookingVisible !== false
    );
  }
  return false;
}

/**
 * Any booking type is enabled and visible (for nav "Programare" link).
 */
export function isAnyBookingEnabled(flags: FeatureFlags): boolean {
  return (
    isBookingEnabled(flags, "general") ||
    isBookingEnabled(flags, "tyre") ||
    isBookingEnabled(flags, "carWash")
  );
}

export function isPartsOrderingEnabled(flags: FeatureFlags): boolean {
  return !!(flags.partsOrdering && flags.partsOrderingVisible !== false);
}

export function isCardInstallmentEnabled(flags: FeatureFlags): boolean {
  return !!(
    flags.cardInstallmentPayment &&
    flags.cardInstallmentPaymentVisible !== false
  );
}
