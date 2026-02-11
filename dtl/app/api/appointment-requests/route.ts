import { NextResponse } from "next/server";

/** Stub for when no external API is set. Accepts booking payload and returns 201 so the form does not "Failed to fetch". */
export async function POST(request: Request) {
  try {
    await request.json(); // validate body exists
    return NextResponse.json(
      { id: "apt-" + Date.now(), status: "requested" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
