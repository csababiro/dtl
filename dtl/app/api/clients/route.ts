import { NextResponse } from "next/server";
import { getClientsFromDb } from "@/lib/db/clients";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getClientsFromDb();
  return NextResponse.json({ items });
}
