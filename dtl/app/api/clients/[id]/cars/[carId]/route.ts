import { NextResponse } from "next/server";
import {
  getClientById,
  getCarById,
  updateClientCar,
  deleteClientCar,
} from "@/lib/services";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; carId: string }> }
) {
  const { id, carId } = await params;
  const clientResult = await getClientById(id);
  if ("error" in clientResult)
    return NextResponse.json({ error: clientResult.error.message }, { status: 500 });
  if (!clientResult.data)
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  const carResult = await getCarById(carId);
  if ("error" in carResult)
    return NextResponse.json({ error: carResult.error.message }, { status: 500 });
  if (!carResult.data || carResult.data.clientId !== id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(carResult.data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; carId: string }> }
) {
  const { id, carId } = await params;
  const clientResult = await getClientById(id);
  if ("error" in clientResult)
    return NextResponse.json({ error: clientResult.error.message }, { status: 500 });
  if (!clientResult.data)
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  const carResult = await getCarById(carId);
  if ("error" in carResult)
    return NextResponse.json({ error: carResult.error.message }, { status: 500 });
  if (!carResult.data || carResult.data.clientId !== id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = (await request.json()) as {
      carMake?: string;
      carModel?: string;
      carYear?: string;
      chassis?: string;
    };
    const updates: {
      carMake?: string;
      carModel?: string;
      carYear?: string;
      chassis?: string;
    } = {};
    if (body.carMake !== undefined) updates.carMake = String(body.carMake).trim();
    if (body.carModel !== undefined) updates.carModel = String(body.carModel).trim();
    if (body.carYear !== undefined) updates.carYear = String(body.carYear).trim();
    if (body.chassis !== undefined) updates.chassis = String(body.chassis).trim();
    const result = await updateClientCar(carId, updates);
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json(result.data!);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; carId: string }> }
) {
  const { id, carId } = await params;
  const clientResult = await getClientById(id);
  if ("error" in clientResult)
    return NextResponse.json({ error: clientResult.error.message }, { status: 500 });
  if (!clientResult.data)
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  const carResult = await getCarById(carId);
  if ("error" in carResult)
    return NextResponse.json({ error: carResult.error.message }, { status: 500 });
  if (!carResult.data || carResult.data.clientId !== id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const result = await deleteClientCar(carId);
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  if (!result.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
