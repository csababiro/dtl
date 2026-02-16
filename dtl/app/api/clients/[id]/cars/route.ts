import { NextResponse } from "next/server";
import { getClientById, getCarsByClientId, addClientCar } from "@/lib/services";
import { getAuthFromRequest } from "@/lib/auth/jwt";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const clientResult = await getClientById(id);
  if ("error" in clientResult)
    return NextResponse.json({ error: clientResult.error.message }, { status: 500 });
  if (!clientResult.data)
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  const carsResult = await getCarsByClientId(id);
  if ("error" in carsResult)
    return NextResponse.json({ error: carsResult.error.message }, { status: 500 });
  return NextResponse.json({ items: carsResult.data });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const clientResult = await getClientById(id);
  if ("error" in clientResult)
    return NextResponse.json({ error: clientResult.error.message }, { status: 500 });
  if (!clientResult.data)
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  try {
    const body = (await request.json()) as {
      carMake?: string;
      carModel?: string;
      carYear?: string;
      chassis?: string;
    };
    const carMake = String(body.carMake ?? "").trim();
    const carModel = String(body.carModel ?? "").trim();
    const carYear = String(body.carYear ?? "").trim();
    const chassis = body.chassis != null ? String(body.chassis).trim() : undefined;
    if (!carMake || !carModel || !carYear) {
      return NextResponse.json(
        { error: "carMake, carModel, carYear required" },
        { status: 400 }
      );
    }
    const result = await addClientCar({
      clientId: id,
      carMake,
      carModel,
      carYear,
      chassis,
    });
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json(result.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
