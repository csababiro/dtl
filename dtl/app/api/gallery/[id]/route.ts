import { NextResponse } from "next/server";
import {
  getGalleryItemByIdServer,
  removeGalleryItemServer,
} from "@/lib/gallery-server-store";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = removeGalleryItemServer(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
