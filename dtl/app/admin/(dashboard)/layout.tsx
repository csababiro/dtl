import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminPushSetup } from "@/components/admin/AdminPushSetup";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { JWT_COOKIE, verifyJwt } from "@/lib/auth/jwt";

const LEGACY_SESSION_COOKIE = "dtl_admin_session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mockEnv = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";
  const cookieStore = await cookies();
  const legacy = cookieStore.get(LEGACY_SESSION_COOKIE)?.value;
  const jwtToken = cookieStore.get(JWT_COOKIE)?.value;

  let allowed = mockEnv || legacy === "mock";
  if (!allowed && jwtToken) {
    try {
      const payload = await verifyJwt(jwtToken);
      allowed = !!payload;
    } catch {
      // JWT_SECRET missing or invalid token
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
