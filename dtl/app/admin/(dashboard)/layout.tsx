import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { AdminPushSetup } from "@/components/admin/AdminPushSetup";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AdminPanelGate } from "@/components/admin/AdminPanelGate";
import { AdminAuthProvider } from "@/components/admin/AdminAuthContext";
import { JWT_COOKIE, verifyJwt } from "@/lib/auth/jwt";
import { canAuthManageUsers } from "@/lib/db/users";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const headersList = await headers();
  const jwtToken = cookieStore.get(JWT_COOKIE)?.value;
  const cookieHeader = headersList.get("cookie");
  const cookieNames = cookieHeader
    ? cookieHeader.split(";").map((s) => s.trim().split("=")[0]).filter(Boolean)
    : [];

  let payload: { sub: string; role: string } | null = null;
  let verifyErr: string | null = null;
  if (jwtToken) {
    try {
      payload = await verifyJwt(jwtToken);
    } catch (e) {
      verifyErr = e instanceof Error ? e.message : "unknown";
    }
  }
  // #region agent log
  console.log(
    "[DEBUG-4f08c8]",
    JSON.stringify({
      loc: "layout",
      path: headersList.get("x-pathname") ?? headersList.get("x-invoke-path") ?? headersList.get("next-url") ?? "unknown",
      hasToken: Boolean(jwtToken),
      tokenLen: jwtToken?.length ?? 0,
      hasPayload: Boolean(payload),
      verifyErr,
      hasCookieHeader: Boolean(cookieHeader),
      cookieCount: cookieNames.length,
      cookieNames,
      hasJwtCookie: cookieNames.includes(JWT_COOKIE),
      headers: {
        rsc: headersList.get("rsc") ?? headersList.get("RSC"),
        nextRouterPrefetch: headersList.get("next-router-prefetch") ?? headersList.get("Next-Router-Prefetch"),
        secFetchDest: headersList.get("sec-fetch-dest"),
        secFetchMode: headersList.get("sec-fetch-mode"),
        purpose: headersList.get("purpose"),
      },
    })
  );
  // #endregion
  if (!payload) {
    redirect("/admin/login");
  }

  const canManageUsers = await canAuthManageUsers(payload);

  return (
    <>
      <AdminPushSetup />
      <AdminAuthProvider value={{ ...payload, canManageUsers }}>
        <AdminPanelGate role={payload.role}>
          <AdminDashboardShell>{children}</AdminDashboardShell>
        </AdminPanelGate>
      </AdminAuthProvider>
    </>
  );
}
