import { NextResponse } from "next/server";
import { getQuoteRequestByIdFromDb, setQuoteRequestStatusInDb } from "@/lib/db/quote-requests";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await getQuoteRequestByIdFromDb(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await getQuoteRequestByIdFromDb(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = (await request.json()) as { status?: string };
    const status = body.status != null ? String(body.status).trim() : "";
    if (!status) return NextResponse.json({ error: "status required" }, { status: 400 });
    const updated = await setQuoteRequestStatusInDb(id, status);
    return NextResponse.json(updated!);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
