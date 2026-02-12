import { get } from "./api-client";

export interface FeatureFlags {
  tyreService?: boolean;
  carWash?: boolean;
  requestQuote?: boolean;
  generalServiceBooking?: boolean;
  tyreServiceBooking?: boolean;
  carWashBooking?: boolean;
  partsOrdering?: boolean;
  cardInstallmentPayment?: boolean;
  authentication?: boolean;
  tyreServiceVisible?: boolean;
  carWashVisible?: boolean;
  requestQuoteVisible?: boolean;
  generalServiceBookingVisible?: boolean;
  tyreServiceBookingVisible?: boolean;
  carWashBookingVisible?: boolean;
  partsOrderingVisible?: boolean;
  cardInstallmentPaymentVisible?: boolean;
  authenticationVisible?: boolean;
  showServicePrices?: boolean;
  showTyreServicePrices?: boolean;
  showCarWashPrices?: boolean;
}

/** Admin-only: per-role toggles. Effective = superAdmin && admin. */
export type AdminFlagKey =
  | "tyre"
  | "carWash"
  | "requestQuote"
  | "programare"
  | "authentication"
  | "showServicePrices"
  | "showTyrePrices"
  | "showCarWashPrices";

export interface FeatureFlagToggles {
  [key: string]: { superAdmin: boolean; admin: boolean };
}

export function effectiveFlag(superAdmin: boolean, admin: boolean): boolean {
  return superAdmin && admin;
}

const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  tyreService: true,
  carWash: true,
  requestQuote: true,
  generalServiceBooking: true,
  tyreServiceBooking: true,
  carWashBooking: true,
  partsOrdering: true,
  cardInstallmentPayment: true,
  authentication: true,
  tyreServiceVisible: true,
  carWashVisible: true,
  requestQuoteVisible: true,
  generalServiceBookingVisible: true,
  tyreServiceBookingVisible: true,
  carWashBookingVisible: true,
  partsOrderingVisible: true,
  cardInstallmentPaymentVisible: true,
  authenticationVisible: true,
  showServicePrices: true,
  showTyreServicePrices: true,
  showCarWashPrices: true,
};

export async function getFeatureFlags(): Promise<FeatureFlags> {
  const result = await get<FeatureFlags>("/settings/feature-flags");
  if ("error" in result) {
    return { ...DEFAULT_FEATURE_FLAGS };
  }
  return { ...DEFAULT_FEATURE_FLAGS, ...result.data };
}

export function isModuleEnabled(
  flags: FeatureFlags,
  module: "tyre" | "carWash"
): boolean {
  if (module === "tyre") {
    return flags.tyreService !== false && flags.tyreServiceVisible !== false;
  }
  return flags.carWash !== false && flags.carWashVisible !== false;
}

export function isRequestQuoteEnabled(flags: FeatureFlags): boolean {
  return flags.requestQuote !== false && flags.requestQuoteVisible !== false;
}

export function isBookingEnabled(
  flags: FeatureFlags,
  type: "general" | "tyre" | "carWash"
): boolean {
  if (type === "general") {
    return (
      flags.generalServiceBooking !== false &&
      flags.generalServiceBookingVisible !== false
    );
  }
  if (type === "tyre") {
    return (
      flags.tyreServiceBooking !== false &&
      flags.tyreServiceBookingVisible !== false
    );
  }
  return (
    flags.carWashBooking !== false &&
    flags.carWashBookingVisible !== false
  );
}

export function isAnyBookingEnabled(flags: FeatureFlags): boolean {
  return (
    isBookingEnabled(flags, "general") ||
    isBookingEnabled(flags, "tyre") ||
    isBookingEnabled(flags, "carWash")
  );
}

export function isPartsOrderingEnabled(flags: FeatureFlags): boolean {
  return flags.partsOrdering !== false && flags.partsOrderingVisible !== false;
}

export function isCardInstallmentEnabled(flags: FeatureFlags): boolean {
  return (
    flags.cardInstallmentPayment !== false &&
    flags.cardInstallmentPaymentVisible !== false
  );
}

export function isAuthenticationEnabled(flags: FeatureFlags): boolean {
  return (
    flags.authentication !== false && flags.authenticationVisible !== false
  );
}

export function isServicePriceVisible(flags: FeatureFlags): boolean {
  return flags.showServicePrices !== false;
}

export function isTyrePriceVisible(flags: FeatureFlags): boolean {
  return flags.showTyreServicePrices !== false;
}

export function isCarWashPriceVisible(flags: FeatureFlags): boolean {
  return flags.showCarWashPrices !== false;
}
