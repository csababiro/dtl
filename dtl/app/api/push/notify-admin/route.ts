import { NextResponse } from "next/server";
import { getAdminTokens } from "@/lib/services";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      type?: string;
      name?: string;
      date?: string;
      time?: string;
    };
    const { type, name, date, time } = body;
    const tokensResult = await getAdminTokens();
    if ("error" in tokensResult)
      return NextResponse.json({ error: tokensResult.error.message }, { status: 500 });
    const tokens = tokensResult.data;
    if (tokens.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 });
    }
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      return NextResponse.json(
        { ok: false, error: "FCM not configured" },
        { status: 503 }
      );
    }
    const { getMessagingInstance } = await import("@/lib/firebase-admin");
    const messaging = getMessagingInstance();
    const isBooking = type === "booking";
    const title = isBooking ? "Programare nouă" : "Cerere ofertă nouă";
    const details = name
      ? isBooking && (date || time)
        ? `${name} · ${[date, time].filter(Boolean).join(" ")}`
        : name
      : "";
    const message = {
      notification: {
        title,
        body:
          details ||
          (isBooking
            ? "O client a trimis o cerere de programare."
            : "O client a trimis o cerere de ofertă."),
      },
      data: {
        type: type ?? "",
        name: name ?? "",
        date: date ?? "",
        time: time ?? "",
      },
      tokens,
    };
    const result = await messaging.sendEachForMulticast(message);
    return NextResponse.json({
      ok: true,
      sent: result.successCount,
      failed: result.failureCount,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Send failed" },
      { status: 500 }
    );
  }
}
