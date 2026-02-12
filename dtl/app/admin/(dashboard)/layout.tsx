import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";

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
      <div className="flex flex-col w-full min-h-screen">
        <AdminHeader />
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
