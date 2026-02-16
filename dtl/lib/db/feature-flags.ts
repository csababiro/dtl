import type { FeatureFlags } from "@/lib/feature-flags";
import { sql } from "./index";

const DEFAULTS: FeatureFlags = {
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
};

export async function getFeatureFlagsFromDb(): Promise<FeatureFlags> {
  const { rows } = await sql`SELECT data FROM feature_flags WHERE id = 1`;
  const data = rows[0]?.data as Record<string, unknown> | undefined;
  return { ...DEFAULTS, ...data } as FeatureFlags;
}

export async function putFeatureFlagsInDb(payload: Partial<FeatureFlags>): Promise<FeatureFlags> {
  const current = await getFeatureFlagsFromDb();
  const stored = { ...current, ...payload };
  // Upsert so save works even if schema INSERT never ran (no row id=1 yet)
  await sql`
    INSERT INTO feature_flags (id, data) VALUES (1, ${JSON.stringify(stored)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
  return stored;
}
