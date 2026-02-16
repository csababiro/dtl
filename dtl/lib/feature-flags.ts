import { getFeatureFlags as getFeatureFlagsFromApi } from "./api/settings";

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
  gallery?: boolean;
  testimonials?: boolean;
  /** When false, only super_admin can access admin panel; others see "Panel dezactivat". */
  adminPanelEnabled?: boolean;
  /** When false, public site shows maintenance page (super_admin still has access). */
  publicSiteEnabled?: boolean;
}

/** Admin-only: one toggle per flag (super_admin only). */
export type AdminFlagKey =
  | "tyre"
  | "carWash"
  | "requestQuote"
  | "programare"
  | "authentication"
  | "showServicePrices"
  | "showTyrePrices"
  | "showCarWashPrices"
  | "gallery"
  | "testimonials"
  | "adminPanelEnabled"
  | "publicSiteEnabled";

/** Single boolean per flag (no per-role). */
export interface FeatureFlagToggles {
  [key: string]: { superAdmin: boolean; admin: boolean };
}

export function effectiveFlag(superAdmin: boolean, admin: boolean): boolean {
  return superAdmin && admin;
}

/** Map stored FeatureFlags (from DB) to admin UI toggles. Single value for both columns. */
export function featureFlagsToToggles(flags: Partial<FeatureFlags>): FeatureFlagToggles {
  const b = (v: boolean | undefined) => v !== false;
  return {
    tyre: { superAdmin: b(flags.tyreService), admin: b(flags.tyreService) },
    carWash: { superAdmin: b(flags.carWash), admin: b(flags.carWash) },
    requestQuote: { superAdmin: b(flags.requestQuote), admin: b(flags.requestQuote) },
    programare: { superAdmin: b(flags.generalServiceBooking), admin: b(flags.generalServiceBooking) },
    authentication: { superAdmin: b(flags.authentication), admin: b(flags.authentication) },
    showServicePrices: { superAdmin: b(flags.showServicePrices), admin: b(flags.showServicePrices) },
    showTyrePrices: { superAdmin: b(flags.showTyreServicePrices), admin: b(flags.showTyreServicePrices) },
    showCarWashPrices: { superAdmin: b(flags.showCarWashPrices), admin: b(flags.showCarWashPrices) },
    gallery: { superAdmin: b(flags.gallery), admin: b(flags.gallery) },
    testimonials: { superAdmin: b(flags.testimonials), admin: b(flags.testimonials) },
    adminPanelEnabled: { superAdmin: b(flags.adminPanelEnabled), admin: b(flags.adminPanelEnabled) },
    publicSiteEnabled: { superAdmin: b(flags.publicSiteEnabled), admin: b(flags.publicSiteEnabled) },
  };
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
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
  gallery: true,
  testimonials: true,
  adminPanelEnabled: true,
  publicSiteEnabled: true,
};

export async function getFeatureFlags(): Promise<FeatureFlags> {
  const result = await getFeatureFlagsFromApi();
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

export function isGalleryEnabled(flags: FeatureFlags): boolean {
  return flags.gallery !== false;
}

export function isTestimonialsEnabled(flags: FeatureFlags): boolean {
  return flags.testimonials !== false;
}
