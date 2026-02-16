import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { t } from "@/lib/i18n";
import { getUsers } from "@/lib/api/users";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";
import { JWT_COOKIE, verifyJwt } from "@/lib/auth/jwt";
import { canAuthManageUsers } from "@/lib/db/users";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get(JWT_COOKIE)?.value;
  const payload = jwtToken ? await verifyJwt(jwtToken) : null;
  const canManageUsers = payload ? await canAuthManageUsers(payload) : false;
  if (!canManageUsers) {
    redirect("/admin");
  }
  const result = await getUsers();
  const users = "data" in result ? result.data : [];
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
