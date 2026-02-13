import { NextResponse } from "next/server";
import { DUMMY_CLIENTS } from "@/lib/dummy-clients";

export async function GET() {
  return NextResponse.json({ items: DUMMY_CLIENTS });
}
