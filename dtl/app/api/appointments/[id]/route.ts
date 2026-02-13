import { NextResponse } from "next/server";
import { format, parse } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointmentDateTime,
  deleteAppointment,
  updateAppointmentNotes,
} from "@/lib/appointments-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appointment = getAppointmentById(id);
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(appointment);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appointment = getAppointmentById(id);
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
      const updated = updateAppointmentStatus(id, body.status);
      if (updated) return NextResponse.json(updated);
    }
    if (body.data !== undefined && body.ora !== undefined) {
      const dataInput = String(body.data).trim();
      const ora = String(body.ora).trim();
      if (!dataInput || !ora) return NextResponse.json({ error: "data and ora required" }, { status: 400 });
      const parsed = parse(dataInput, "yyyy-MM-dd", new Date());
      const data = format(parsed, "d MMM yyyy", { locale: enUS });
      const updated = updateAppointmentDateTime(id, data, ora);
      if (updated) return NextResponse.json(updated);
    }
    if (body.descriere !== undefined || body.clientNotes !== undefined) {
      const updated = updateAppointmentNotes(id, {
        descriere: body.descriere,
        clientNotes: body.clientNotes,
      });
      if (updated) return NextResponse.json(updated);
    }
    return NextResponse.json(getAppointmentById(id));
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = deleteAppointment(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
