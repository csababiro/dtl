import { NextResponse } from "next/server";
import { format, parse } from "date-fns";
import { enUS } from "date-fns/locale";
import { createAppointment, ensureClient } from "@/lib/services";

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
    const marca = String(body.carMake ?? "").trim();
    const model = String(body.carModel ?? "").trim();
    const id = "apt-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    const result = await createAppointment({
      id,
      nume: name,
      telefon: phone,
      email,
      data: dataFormatted,
      ora: time,
      marca,
      model,
      tip,
      status: "În așteptare",
      descriere: body.description != null ? String(body.description).trim() : undefined,
    });
    if ("error" in result)
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    const car = [marca, model].filter(Boolean).join(" ") || undefined;
    await ensureClient({ name, email, phone, car });
    return NextResponse.json(
      { id: result.data.id, status: "requested" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
