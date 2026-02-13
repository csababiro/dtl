import { NextResponse } from "next/server";
import { format, parse } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  getAppointmentByIdFromDb,
  updateAppointmentStatusInDb,
  updateAppointmentDateTimeInDb,
  deleteAppointmentFromDb,
  updateAppointmentNotesInDb,
} from "@/lib/db/appointments";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appointment = await getAppointmentByIdFromDb(id);
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(appointment);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appointment = await getAppointmentByIdFromDb(id);
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = (await request.json()) as {
      status?: string;
      data?: string;
      ora?: string;
      descriere?: string;
      clientNotes?: string;
    };
    if (body.status !== undefined) {
      if (body.status !== "Confirmat" && body.status !== "În așteptare") {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      const updated = await updateAppointmentStatusInDb(id, body.status);
      if (updated) return NextResponse.json(updated);
    }
    if (body.data !== undefined && body.ora !== undefined) {
      const dataInput = String(body.data).trim();
      const ora = String(body.ora).trim();
      if (!dataInput || !ora)
        return NextResponse.json({ error: "data and ora required" }, { status: 400 });
      const parsed = parse(dataInput, "yyyy-MM-dd", new Date());
      const data = format(parsed, "d MMM yyyy", { locale: enUS });
      const updated = await updateAppointmentDateTimeInDb(id, data, ora);
      if (updated) return NextResponse.json(updated);
    }
    if (body.descriere !== undefined || body.clientNotes !== undefined) {
      const updated = await updateAppointmentNotesInDb(id, {
        descriere: body.descriere,
        clientNotes: body.clientNotes,
      });
      if (updated) return NextResponse.json(updated);
    }
    const final = await getAppointmentByIdFromDb(id);
    return NextResponse.json(final!);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = await deleteAppointmentFromDb(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
