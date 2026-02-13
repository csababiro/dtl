import { NextResponse } from "next/server";
import { getClientById, getPlatiByClientId } from "@/lib/services";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clientResult = await getClientById(id);
  if ("error" in clientResult)
    return NextResponse.json({ error: clientResult.error.message }, { status: 500 });
  if (!clientResult.data)
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  const platiResult = await getPlatiByClientId(id);
  if ("error" in platiResult)
    return NextResponse.json({ error: platiResult.error.message }, { status: 500 });
  return NextResponse.json({ items: platiResult.data });
}
