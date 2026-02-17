import { NextResponse } from "next/server";
import { getServicesByCategory, addService } from "@/lib/services";
import { getAuthFromRequest } from "@/lib/auth/jwt";
import type { ServiceCategoryId } from "@/lib/services-data";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES: ServiceCategoryId[] = ["general", "anvelope", "spalatorie"];

function isServiceCategoryId(s: string): s is ServiceCategoryId {
  return VALID_CATEGORIES.includes(s as ServiceCategoryId);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  if (!category || !isServiceCategoryId(category)) {
    return NextResponse.json(
      { error: "Query param category required: general | anvelope | spalatorie" },
      { status: 400 }
    );
  }
  const result = await getServicesByCategory(category);
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ items: result.data });
}

export async function POST(request: Request) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as {
      category?: string;
      name?: string;
      price?: string;
    };
    const category = body.category != null ? String(body.category).trim() : "";
    const name = body.name != null ? String(body.name).trim() : "";
    const price = body.price != null ? String(body.price).trim() : "";
    if (!isServiceCategoryId(category)) {
      return NextResponse.json(
        { error: "category required: general | anvelope | spalatorie" },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }
    const result = await addService({ category, name, price });
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json(result.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
