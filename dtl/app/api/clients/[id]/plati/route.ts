import { NextResponse } from "next/server";
import { getClientById } from "@/lib/dummy-clients";
import { getPlatiByClientId } from "@/lib/plati-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = getClientById(id);
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  const items = getPlatiByClientId(id);
  return NextResponse.json({ items });
}
