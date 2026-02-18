import { NextResponse } from "next/server";
import { getPublicSiteSettings } from "@/lib/services";

export const dynamic = "force-dynamic";

/**
 * Public API: returns phone, address, email, whatsapp, etc. for the frontend.
 * No auth required so customer layout and pages can display admin-set contact info.
 */
export async function GET() {
  const result = await getPublicSiteSettings();
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json(result.data);
}
