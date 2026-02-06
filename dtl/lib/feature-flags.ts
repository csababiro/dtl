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
  tyreServiceVisible?: boolean;
  carWashVisible?: boolean;
  requestQuoteVisible?: boolean;
  generalServiceBookingVisible?: boolean;
  tyreServiceBookingVisible?: boolean;
  carWashBookingVisible?: boolean;
  partsOrderingVisible?: boolean;
  cardInstallmentPaymentVisible?: boolean;
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
  tyreServiceVisible: true,
  carWashVisible: true,
  requestQuoteVisible: true,
  generalServiceBookingVisible: true,
  tyreServiceBookingVisible: true,
  carWashBookingVisible: true,
  partsOrderingVisible: true,
  cardInstallmentPaymentVisible: true,
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
