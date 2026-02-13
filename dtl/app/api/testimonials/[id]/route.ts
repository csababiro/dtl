import { NextResponse } from "next/server";
import {
  getTestimonialByIdFromDb,
  updateTestimonialInDb,
  removeTestimonialFromDb,
} from "@/lib/db/testimonials";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await getTestimonialByIdFromDb(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await getTestimonialByIdFromDb(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
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
    const updated = await updateTestimonialInDb(id, updates);
    return NextResponse.json(updated!);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = await removeTestimonialFromDb(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
