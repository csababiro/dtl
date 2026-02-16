import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminPushSetup } from "@/components/admin/AdminPushSetup";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { JWT_COOKIE, verifyJwt } from "@/lib/auth/jwt";
import { getFeatureFlagsFromDb } from "@/lib/db/feature-flags";

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

  if (payload.role !== "super_admin") {
    const flags = await getFeatureFlagsFromDb();
    if (flags.adminPanelEnabled === false) {
      redirect("/admin/disabled");
    }
  }

  return (
    <>
      <AdminPushSetup />
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </>
  );
}
