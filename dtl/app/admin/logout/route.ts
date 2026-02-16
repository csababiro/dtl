import { NextRequest, NextResponse } from "next/server";
import { JWT_COOKIE } from "@/lib/auth/jwt";

const LEGACY_SESSION_COOKIE = "dtl_admin_session";

export function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  const res = NextResponse.redirect(url);
  res.cookies.set(LEGACY_SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  res.cookies.set(JWT_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
