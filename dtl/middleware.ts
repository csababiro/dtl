import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();
  if (request.nextUrl.pathname === "/admin/login" || request.nextUrl.pathname === "/admin/logout")
    return NextResponse.next();

  const cookieHeader = request.headers.get("cookie");
  const jwtCookie = "dtl_admin_jwt";
  const hasJwt = cookieHeader?.includes(`${jwtCookie}=`);
  const cookieNames = cookieHeader
    ? cookieHeader.split(";").map((s) => s.trim().split("=")[0]).filter(Boolean)
    : [];

  // #region agent log
  console.log(
    "[DEBUG-4f08c8]",
    JSON.stringify({
      loc: "middleware",
      path: request.nextUrl.pathname,
      method: request.method,
      hasCookieHeader: Boolean(cookieHeader),
      cookieCount: cookieNames.length,
      cookieNames,
      hasJwtCookie: cookieNames.includes(jwtCookie),
      headers: {
        rsc: request.headers.get("rsc") ?? request.headers.get("RSC"),
        nextRouterPrefetch: request.headers.get("next-router-prefetch") ?? request.headers.get("Next-Router-Prefetch"),
        secFetchDest: request.headers.get("sec-fetch-dest"),
        secFetchMode: request.headers.get("sec-fetch-mode"),
        purpose: request.headers.get("purpose"),
        xNextjsData: request.headers.get("x-nextjs-data"),
      },
    })
  );
  // #endregion

  return NextResponse.next();
}
