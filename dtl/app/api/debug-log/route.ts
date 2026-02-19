import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[DEBUG-4f08c8]", JSON.stringify({ loc: "client", ...body }));
  } catch {
    // ignore
  }
  return NextResponse.json({ ok: true });
}
