import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { t } from "@/lib/i18n";
import { getUsers } from "@/lib/api/users";
import { getCurrentUserCanManageUsers } from "@/lib/services";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";
import { JWT_COOKIE, verifyJwt } from "@/lib/auth/jwt";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get(JWT_COOKIE)?.value;
  const payload = jwtToken ? await verifyJwt(jwtToken) : null;
  if (!payload || payload.role !== "super_admin") {
    redirect("/admin");
  }
  const result = await getUsers();
  const users = "data" in result ? result.data : [];
  const canResult = await getCurrentUserCanManageUsers();
  // #region agent log
  fetch("http://127.0.0.1:7244/ingest/38291e03-8924-411d-af90-c560fa478f53", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "app/admin/(dashboard)/users/page.tsx",
      message: "after getCurrentUserCanManageUsers",
      data: {
        hasData: "data" in canResult,
        hasError: "error" in canResult,
        errorMessage: "error" in canResult ? (canResult as { error: { message?: string } }).error?.message?.slice(0, 60) : undefined,
      },
      timestamp: Date.now(),
      hypothesisId: "D",
    }),
  }).catch(() => {});
  // #endregion
  const canManageUsers = "data" in canResult ? canResult.data : false;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          {t("admin.users")}
        </h1>
        <p className="text-slate-500 mt-1">
          {t("admin.usersListDesc")}
        </p>
      </div>

      <AdminUsersClient users={users} canManageUsers={canManageUsers} />
    </div>
  );
}
