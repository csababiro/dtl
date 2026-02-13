import { t } from "@/lib/i18n";
import { get } from "@/lib/api-client";
import { getCurrentUserCanManageUsers } from "@/lib/users-store";
import type { DummyUser } from "@/lib/dummy-users";
import { AdminUsersClient } from "@/components/AdminUsersClient";

export default async function AdminUsersPage() {
  const result = await get<{ items: DummyUser[] }>("/users");
  const users = "data" in result ? result.data.items : [];
  const canManageUsers = getCurrentUserCanManageUsers();
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
