import { NextResponse } from "next/server";
import { getTestimonials, addTestimonial } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getTestimonials();
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ items: result.data });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      author?: string;
      role?: string;
      text?: string;
      rating?: number;
      visible?: boolean;
    };
    const author = String(body.author ?? "").trim();
    const text = String(body.text ?? "").trim();
    if (!author || !text) {
      return NextResponse.json(
        { error: "author and text required" },
        { status: 400 }
      );
    }
    const result = await addTestimonial({
      author,
      role: body.role != null ? String(body.role).trim() : undefined,
      text,
      rating: body.rating != null ? Number(body.rating) : undefined,
      visible: body.visible !== false,
    });
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json(result.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
