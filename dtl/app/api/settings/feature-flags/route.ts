import { NextResponse } from "next/server";
import type { FeatureFlags } from "@/lib/feature-flags";

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
  gallery: true,
  testimonials: true,
};

declare global {
  // eslint-disable-next-line no-var
  var __featureFlags: FeatureFlags | undefined;
}

function getStored(): FeatureFlags {
  if (typeof globalThis !== "undefined" && globalThis.__featureFlags) {
    return { ...DEFAULT_FEATURE_FLAGS, ...globalThis.__featureFlags };
  }
  return { ...DEFAULT_FEATURE_FLAGS };
}

export async function GET() {
  return NextResponse.json(getStored());
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as FeatureFlags;
    const stored = { ...DEFAULT_FEATURE_FLAGS, ...getStored(), ...body };
    if (typeof globalThis !== "undefined") globalThis.__featureFlags = stored;
    return NextResponse.json(stored);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
