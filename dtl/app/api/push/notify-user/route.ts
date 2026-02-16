import { NextResponse } from "next/server";
import { getUserToken } from "@/lib/services";
import { getAuthFromRequest } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const payload = (await request.json()) as {
      ref?: string;
      title?: string;
      body?: string;
    };
    const { ref, title, body: bodyText } = payload;
    if (!ref || typeof ref !== "string") {
      return NextResponse.json({ error: "ref required" }, { status: 400 });
    }
    const tokenResult = await getUserToken(ref);
    if ("error" in tokenResult)
      return NextResponse.json({ error: tokenResult.error.message }, { status: 500 });
    const token = tokenResult.data;
    if (!token) {
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
    await messaging.send({
      notification: { title: title ?? "Notificare", body: bodyText ?? "" },
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
