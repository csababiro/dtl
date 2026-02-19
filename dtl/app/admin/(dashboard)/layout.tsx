import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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
  const jwtToken = cookieStore.get(JWT_COOKIE)?.value;

  let payload: { sub: string; role: string } | null = null;
  if (jwtToken) {
    try {
      payload = await verifyJwt(jwtToken);
    } catch {
      // JWT invalid or expired
    }
  }
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
