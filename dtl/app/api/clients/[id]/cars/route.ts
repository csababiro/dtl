import { NextResponse } from "next/server";
import { getClientByIdFromDb } from "@/lib/db/clients";
import {
  getCarsByClientIdFromDb,
  addClientCarInDb,
} from "@/lib/db/client-cars";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = await getClientByIdFromDb(id);
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  const items = await getCarsByClientIdFromDb(id);
  return NextResponse.json({ items });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = await getClientByIdFromDb(id);
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
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
    const car = await addClientCarInDb({
      clientId: id,
      carMake,
      carModel,
      carYear,
      chassis,
    });
    return NextResponse.json(car, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
