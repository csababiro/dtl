import { NextResponse } from "next/server";
import { getPlataById, updatePlataNotes } from "@/lib/services";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getPlataById(id);
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  if (!result.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result.data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const plataResult = await getPlataById(id);
  if ("error" in plataResult)
    return NextResponse.json({ error: plataResult.error.message }, { status: 500 });
  if (!plataResult.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = (await request.json()) as { notes?: string };
    const notes = body.notes != null ? String(body.notes) : "";
    const result = await updatePlataNotes(id, notes);
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json(result.data!);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
