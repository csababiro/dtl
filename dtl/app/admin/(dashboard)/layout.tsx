import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminPushSetup } from "@/components/admin/AdminPushSetup";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { JWT_COOKIE, verifyJwt } from "@/lib/auth/jwt";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get(JWT_COOKIE)?.value;

  let allowed = false;
  if (jwtToken) {
    try {
      const payload = await verifyJwt(jwtToken);
      allowed = !!payload;
    } catch {
      // JWT invalid or expired
    }
  }
  if (!allowed) {
    redirect("/admin/login");
  }

  return (
    <>
      <AdminPushSetup />
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </>
  );
}
