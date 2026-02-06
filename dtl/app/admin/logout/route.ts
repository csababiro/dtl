import { NextRequest, NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "dtl_admin_session";

export function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  const res = NextResponse.redirect(url);
  res.cookies.set(ADMIN_SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
