import { NextResponse } from "next/server";
import { format, parse } from "date-fns";
import { enUS } from "date-fns/locale";
import { createAppointmentInDb } from "@/lib/db/appointments";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      carMake?: string;
      carModel?: string;
      carYear?: string;
      description?: string;
      date?: string;
      time?: string;
      type?: "general" | "tyre" | "carWash";
    };
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const dateInput = String(body.date ?? "").trim();
    const time = String(body.time ?? "").trim();
    const tip = body.type === "tyre" || body.type === "carWash" ? body.type : "general";
    if (!name || !email || !dateInput || !time) {
      return NextResponse.json(
        { error: "name, email, date and time required" },
        { status: 400 }
      );
    }
    let dataFormatted: string;
    try {
      const parsed = parse(dateInput, "yyyy-MM-dd", new Date());
      dataFormatted = format(parsed, "d MMM yyyy", { locale: enUS });
    } catch {
      dataFormatted = dateInput;
    }
    const id = "apt-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    const appointment = await createAppointmentInDb({
      id,
      nume: name,
      telefon: phone,
      email,
      data: dataFormatted,
      ora: time,
      marca: String(body.carMake ?? "").trim(),
      model: String(body.carModel ?? "").trim(),
      tip,
      status: "În așteptare",
      descriere: body.description != null ? String(body.description).trim() : undefined,
    });
    return NextResponse.json(
      { id: appointment.id, status: "requested" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
