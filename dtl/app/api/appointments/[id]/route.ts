import { NextResponse } from "next/server";
import { format, parse } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointmentDateTime,
  updateAppointmentNotes,
  deleteAppointment,
} from "@/lib/services";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getAppointmentById(id);
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  if (!result.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result.data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appResult = await getAppointmentById(id);
  if ("error" in appResult)
    return NextResponse.json({ error: appResult.error.message }, { status: 500 });
  if (!appResult.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
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
      const result = await updateAppointmentStatus(id, body.status);
      if ("error" in result)
        return NextResponse.json({ error: result.error.message }, { status: 500 });
      if (result.data) return NextResponse.json(result.data);
    }
    if (body.data !== undefined && body.ora !== undefined) {
      const dataInput = String(body.data).trim();
      const ora = String(body.ora).trim();
      if (!dataInput || !ora)
        return NextResponse.json({ error: "data and ora required" }, { status: 400 });
      const parsed = parse(dataInput, "yyyy-MM-dd", new Date());
      const data = format(parsed, "d MMM yyyy", { locale: enUS });
      const result = await updateAppointmentDateTime(id, data, ora);
      if ("error" in result)
        return NextResponse.json({ error: result.error.message }, { status: 500 });
      if (result.data) return NextResponse.json(result.data);
    }
    if (body.descriere !== undefined || body.clientNotes !== undefined) {
      const result = await updateAppointmentNotes(id, {
        descriere: body.descriere,
        clientNotes: body.clientNotes,
      });
      if ("error" in result)
        return NextResponse.json({ error: result.error.message }, { status: 500 });
      if (result.data) return NextResponse.json(result.data);
    }
    const finalResult = await getAppointmentById(id);
    if ("error" in finalResult)
      return NextResponse.json({ error: finalResult.error.message }, { status: 500 });
    return NextResponse.json(finalResult.data!);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await deleteAppointment(id);
  if ("error" in result)
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  if (!result.data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
