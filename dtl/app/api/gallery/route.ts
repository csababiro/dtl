import { NextResponse } from "next/server";
import {
  getGalleryItemsServer,
  addGalleryItemServer,
} from "@/lib/gallery-server-store";

export async function GET() {
  const items = getGalleryItemsServer();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { imageUrl?: string; title?: string; caption?: string };
    const imageUrl = body.imageUrl != null ? String(body.imageUrl).trim() : "";
    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl required" }, { status: 400 });
    }
    const item = addGalleryItemServer({
      imageUrl,
      title: body.title != null ? String(body.title).trim() : "",
      caption: body.caption != null ? String(body.caption).trim() : undefined,
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
