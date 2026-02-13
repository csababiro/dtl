import { NextResponse } from "next/server";
import { getClientByIdFromDb } from "@/lib/db/clients";
import {
  getCarByIdFromDb,
  updateClientCarInDb,
  deleteClientCarFromDb,
} from "@/lib/db/client-cars";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; carId: string }> }
) {
  const { id, carId } = await params;
  const client = await getClientByIdFromDb(id);
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  const car = await getCarByIdFromDb(carId);
  if (!car || car.clientId !== id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(car);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; carId: string }> }
) {
  const { id, carId } = await params;
  const client = await getClientByIdFromDb(id);
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  const car = await getCarByIdFromDb(carId);
  if (!car || car.clientId !== id)
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
    const updated = await updateClientCarInDb(carId, updates);
    return NextResponse.json(updated!);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; carId: string }> }
) {
  const { id, carId } = await params;
  const client = await getClientByIdFromDb(id);
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  const car = await getCarByIdFromDb(carId);
  if (!car || car.clientId !== id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const ok = await deleteClientCarFromDb(carId);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
