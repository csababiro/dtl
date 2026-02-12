import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

/** Serves the OpenAPI spec for Swagger UI. */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "docs", "openapi.yaml");
    const content = await readFile(filePath, "utf-8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": "application/x-yaml",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "OpenAPI spec not found" },
      { status: 404 }
    );
  }
}
