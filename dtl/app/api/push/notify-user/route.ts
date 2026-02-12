import { NextResponse } from "next/server";
import { getUserToken } from "@/lib/push-tokens-store";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { ref?: string; title?: string; body?: string };
    const { ref, title, body } = body;
    if (!ref || typeof ref !== "string") {
      return NextResponse.json({ error: "ref required" }, { status: 400 });
    }
    const token = getUserToken(ref);
    if (!token) {
      return NextResponse.json({ ok: true, sent: 0 });
    }
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      return NextResponse.json({ ok: false, error: "FCM not configured" }, { status: 503 });
    }
    const { getMessagingInstance } = await import("@/lib/firebase-admin");
    const messaging = getMessagingInstance();
    await messaging.send({
      notification: { title: title ?? "Notificare", body: body ?? "" },
      token,
    });
    return NextResponse.json({ ok: true, sent: 1 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Send failed" },
      { status: 500 }
    );
  }
}
