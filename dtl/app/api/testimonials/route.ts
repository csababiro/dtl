import { NextResponse } from "next/server";
import {
  getTestimonialsServer,
  addTestimonialServer,
} from "@/lib/testimonials-server-store";

export async function GET() {
  const items = getTestimonialsServer();
  return NextResponse.json({ items });
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
      return NextResponse.json({ error: "author and text required" }, { status: 400 });
    }
    const item = addTestimonialServer({
      author,
      role: body.role != null ? String(body.role).trim() : undefined,
      text,
      rating: body.rating != null ? Number(body.rating) : undefined,
      visible: body.visible !== false,
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
