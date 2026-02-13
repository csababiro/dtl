import { NextResponse } from "next/server";
import { getPlataByIdFromDb, updatePlataNotesInDb } from "@/lib/db/plati";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const plata = await getPlataByIdFromDb(id);
  if (!plata) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(plata);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const plata = await getPlataByIdFromDb(id);
  if (!plata) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = (await request.json()) as { notes?: string };
    const notes = body.notes != null ? String(body.notes) : "";
    const updated = await updatePlataNotesInDb(id, notes);
    return NextResponse.json(updated!);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
