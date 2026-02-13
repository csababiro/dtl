import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminPushSetup } from "@/components/admin/AdminPushSetup";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";

const ADMIN_SESSION_COOKIE = "dtl_admin_session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mockEnv = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const allowed = mockEnv || session === "mock";
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
