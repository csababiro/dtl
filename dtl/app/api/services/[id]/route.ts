import { NextResponse } from "next/server";
import {
  getServiceById,
  updateService,
  deleteService,
} from "@/lib/services";
import { getAuthFromRequest } from "@/lib/auth/jwt";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getServiceById(id);
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  if (!result.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result.data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = (await request.json()) as { name?: string; price?: string };
    const updates: { name?: string; price?: string } = {};
    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (body.price !== undefined) updates.price = String(body.price).trim();
    const result = await updateService(id, updates);
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    if (!result.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const result = await deleteService(id);
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  if (!result.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
