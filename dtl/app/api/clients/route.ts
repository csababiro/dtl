import { NextResponse } from "next/server";
import { getClients } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getClients();
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ items: result.data });
}
