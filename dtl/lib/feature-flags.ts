/**
 * Feature flags: two-tier (Super Admin enables; Admin shows/hides).
 * Fetched from API when available; default when no API: all ON.
 * Tyre and Car Wash are optional modules; others are sub-features.
 */

export type BookingType = "general" | "tyre" | "carWash";

export interface FeatureFlags {
  /** Tyre module (optional) */
  tyreModule: boolean;
  /** Car Wash module (optional) */
  carWashModule: boolean;
  /** General Service booking */
  generalServiceBooking: boolean;
  /** Tyre Service booking */
  tyreServiceBooking: boolean;
  /** Car Wash booking */
  carWashBooking: boolean;
  /** Parts ordering */
  partsOrdering: boolean;
  /** Card installment (ads only) */
  cardInstallment: boolean;
  /** Admin visibility overrides (show/hide to customers) – applied on top of Super Admin flags */
  adminShowTyre: boolean;
  adminShowCarWash: boolean;
  adminShowGeneralBooking: boolean;
  adminShowTyreBooking: boolean;
  adminShowCarWashBooking: boolean;
  adminShowPartsOrdering: boolean;
  adminShowCardInstallment: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  tyreModule: true,
  carWashModule: true,
  generalServiceBooking: true,
  tyreServiceBooking: true,
  carWashBooking: true,
  partsOrdering: true,
  cardInstallment: true,
  adminShowTyre: true,
  adminShowCarWash: true,
  adminShowGeneralBooking: true,
  adminShowTyreBooking: true,
  adminShowCarWashBooking: true,
  adminShowPartsOrdering: true,
  adminShowCardInstallment: true,
};

let cachedFlags: FeatureFlags | null = null;

function mergeWithDefaults(api: Partial<FeatureFlags> | null): FeatureFlags {
  if (!api) return { ...DEFAULT_FLAGS };
  return {
    ...DEFAULT_FLAGS,
    ...api,
  };
}

/**
 * Resolve effective customer-facing flag: Super Admin enabled AND Admin visible.
 */
function effective(
  superOn: boolean,
  adminShow: boolean
): boolean {
  return superOn && adminShow;
}

/**
 * Get feature flags. Uses cache; fetches from API when available (client-side).
 * Server-side or when API unavailable: returns defaults (all ON).
 */
export async function getFeatureFlags(): Promise<FeatureFlags> {
  if (typeof window === "undefined") {
    return mergeWithDefaults(null);
  }
  if (cachedFlags) return cachedFlags;

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    cachedFlags = mergeWithDefaults(null);
    return cachedFlags;
  }

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/feature-flags`);
    if (res.ok) {
      const data = (await res.json()) as Partial<FeatureFlags>;
      cachedFlags = mergeWithDefaults(data);
      return cachedFlags;
    }
  } catch {
    // Offline or API not ready: use defaults
  }
  cachedFlags = mergeWithDefaults(null);
  return cachedFlags;
}

/**
 * Get feature flags synchronously (e.g. for initial render). Returns defaults when no cache.
 */
export function getFeatureFlagsSync(): FeatureFlags {
  return cachedFlags ?? mergeWithDefaults(null);
}

/**
 * Invalidate cache (e.g. after Admin changes flags).
 */
export function invalidateFeatureFlagsCache(): void {
  cachedFlags = null;
}

/** Is Tyre module visible to customers? */
export function isModuleEnabled(module: "tyre" | "carWash", flags?: FeatureFlags): boolean {
  const f = flags ?? getFeatureFlagsSync();
  if (module === "tyre") return effective(f.tyreModule, f.adminShowTyre);
  return effective(f.carWashModule, f.adminShowCarWash);
}

/** Is booking enabled for this type (customer-facing)? */
export function isBookingEnabled(type: BookingType, flags?: FeatureFlags): boolean {
  const f = flags ?? getFeatureFlagsSync();
  switch (type) {
    case "general":
      return effective(f.generalServiceBooking, f.adminShowGeneralBooking);
    case "tyre":
      return effective(f.tyreModule, f.adminShowTyre) && effective(f.tyreServiceBooking, f.adminShowTyreBooking);
    case "carWash":
      return effective(f.carWashModule, f.adminShowCarWash) && effective(f.carWashBooking, f.adminShowCarWashBooking);
    default:
      return false;
  }
}

/** Is at least one booking type enabled? */
export function isAnyBookingEnabled(flags?: FeatureFlags): boolean {
  return (
    isBookingEnabled("general", flags) ||
    isBookingEnabled("tyre", flags) ||
    isBookingEnabled("carWash", flags)
  );
}

/** Is Card Installment (ads) visible? */
export function isCardInstallmentEnabled(flags?: FeatureFlags): boolean {
  const f = flags ?? getFeatureFlagsSync();
  return effective(f.cardInstallment, f.adminShowCardInstallment);
}

/** Is Parts Ordering visible? */
export function isPartsOrderingEnabled(flags?: FeatureFlags): boolean {
  const f = flags ?? getFeatureFlagsSync();
  return effective(f.partsOrdering, f.adminShowPartsOrdering);
}
