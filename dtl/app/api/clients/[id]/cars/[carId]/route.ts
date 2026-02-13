import { NextResponse } from "next/server";
import { getClientById } from "@/lib/dummy-clients";
import {
  getCarById,
  updateClientCar,
  deleteClientCar,
} from "@/lib/client-cars-store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; carId: string }> }
) {
  const { id, carId } = await params;
  const client = getClientById(id);
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  const car = getCarById(carId);
  if (!car || car.clientId !== id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = (await request.json()) as {
      carMake?: string;
      carModel?: string;
      carYear?: string;
      chassis?: string;
    };
    const updates: { carMake?: string; carModel?: string; carYear?: string; chassis?: string } = {};
    if (body.carMake !== undefined) updates.carMake = String(body.carMake).trim();
    if (body.carModel !== undefined) updates.carModel = String(body.carModel).trim();
    if (body.carYear !== undefined) updates.carYear = String(body.carYear).trim();
    if (body.chassis !== undefined) updates.chassis = String(body.chassis).trim();
    const updated = updateClientCar(carId, updates);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; carId: string }> }
) {
  const { id, carId } = await params;
  const client = getClientById(id);
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  const car = getCarById(carId);
  if (!car || car.clientId !== id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const ok = deleteClientCar(carId);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
