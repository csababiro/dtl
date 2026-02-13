import { NextResponse } from "next/server";
import { getGalleryItems, addGalleryItem } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getGalleryItems();
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ items: result.data });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      imageUrl?: string;
      title?: string;
      caption?: string;
    };
    const imageUrl = body.imageUrl != null ? String(body.imageUrl).trim() : "";
    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl required" }, { status: 400 });
    }
    const result = await addGalleryItem({
      imageUrl,
      title: body.title != null ? String(body.title).trim() : undefined,
      caption: body.caption != null ? String(body.caption).trim() : undefined,
    });
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json(result.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
