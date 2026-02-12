import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminSidebar } from "@/components/AdminSidebar";

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
    <div className="min-h-screen bg-slate-50 pl-64">
      <AdminSidebar />
      <main className="p-8 w-full min-h-screen">{children}</main>
    </div>
  );
}
