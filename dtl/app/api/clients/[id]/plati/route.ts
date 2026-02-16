import { NextResponse } from "next/server";
import { getClientById, getPlatiByClientId } from "@/lib/services";
import { getAuthFromRequest } from "@/lib/auth/jwt";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
