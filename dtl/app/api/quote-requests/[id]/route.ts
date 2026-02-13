import { NextResponse } from "next/server";
import { getQuoteRequestById, setQuoteRequestStatus } from "@/lib/quote-requests-store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = getQuoteRequestById(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = (await request.json()) as { status?: string };
    const status = body.status != null ? String(body.status).trim() : "";
    if (!status) return NextResponse.json({ error: "status required" }, { status: 400 });
    const updated = setQuoteRequestStatus(id, status);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
