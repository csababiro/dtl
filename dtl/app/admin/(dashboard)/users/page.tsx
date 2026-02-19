"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import {
  getUsersAction,
  createUserAction,
  updateUserAction,
  deleteUserAction,
  setUserPasswordAction,
} from "./actions";
import type { DummyUser } from "@/lib/dummy-users";

export default function AdminUsersPage() {
  const router = useRouter();
  const auth = useAdminAuth();
  const [users, setUsers] = useState<DummyUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/debug-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "users_page_mount",
        hasAuth: Boolean(auth),
        canManageUsers: auth?.canManageUsers,
        role: auth?.role,
      }),
    }).catch(() => {});
    if (!auth) return;
    if (!auth.canManageUsers) {
      router.replace("/admin");
      return;
    }
    let cancelled = false;
    getUsersAction().then((result) => {
      if (cancelled) return;
      setUsers("data" in result ? result.data : []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [auth, router]);

  const refetch = async () => {
    const result = await getUsersAction();
    if ("data" in result) setUsers(result.data);
  };

  const actions = {
    createUser: createUserAction,
    updateUser: updateUserAction,
    deleteUser: deleteUserAction,
    setUserPassword: setUserPasswordAction,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{t("admin.users")}</h1>
          <p className="text-slate-500 mt-1">{t("admin.usersListDesc")}</p>
        </div>
        <p className="text-slate-500">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">{t("admin.users")}</h1>
        <p className="text-slate-500 mt-1">{t("admin.usersListDesc")}</p>
      </div>
      <AdminUsersClient
        users={users}
        canManageUsers={auth?.canManageUsers ?? false}
        currentUserId={auth?.sub ?? ""}
        isSuperAdmin={auth?.role === "super_admin"}
        onRefetch={refetch}
        actions={actions}
      />
    </div>
  );
}
