import { NextResponse } from "next/server";
import { getClientByIdFromDb } from "@/lib/db/clients";
import { getPlatiByClientIdFromDb } from "@/lib/db/plati";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = await getClientByIdFromDb(id);
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  const items = await getPlatiByClientIdFromDb(id);
  return NextResponse.json({ items });
}
