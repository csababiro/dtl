import { NextResponse } from "next/server";
import {
  getTestimonialById,
  updateTestimonial,
  removeTestimonial,
} from "@/lib/services";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getTestimonialById(id);
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
  const itemResult = await getTestimonialById(id);
  if ("error" in itemResult)
    return NextResponse.json({ error: itemResult.error.message }, { status: 500 });
  if (!itemResult.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = (await request.json()) as {
      author?: string;
      role?: string;
      text?: string;
      rating?: number;
      visible?: boolean;
    };
    const updates: Partial<{
      author: string;
      role: string;
      text: string;
      rating: number;
      visible: boolean;
    }> = {};
    if (body.author !== undefined) updates.author = String(body.author).trim();
    if (body.role !== undefined) updates.role = String(body.role).trim();
    if (body.text !== undefined) updates.text = String(body.text).trim();
    if (body.rating !== undefined) updates.rating = Number(body.rating);
    if (body.visible !== undefined) updates.visible = Boolean(body.visible);
    const result = await updateTestimonial(id, updates);
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json(result.data!);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await removeTestimonial(id);
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  if (!result.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
