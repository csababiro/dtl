"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import { getUsers } from "@/lib/api/users";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";
import type { DummyUser } from "@/lib/dummy-users";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<DummyUser[]>([]);
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/auth/me", { credentials: "include", cache: "no-store" }).then((r) =>
        r.ok ? r.json() : null
      ),
      getUsers(),
    ]).then(([me, usersResult]) => {
      if (cancelled) return;
      if (!me?.canManageUsers) {
        router.replace("/admin");
        return;
      }
      setCanManageUsers(Boolean(me.canManageUsers));
      setCurrentUserId(me.sub ?? "");
      setIsSuperAdmin(me.role === "super_admin");
      setUsers("data" in usersResult ? usersResult.data : []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const refetchUsers = () =>
    getUsers().then((r) => setUsers("data" in r ? r.data : []));

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
        canManageUsers={canManageUsers}
        currentUserId={currentUserId}
        isSuperAdmin={isSuperAdmin}
        onRefetch={refetchUsers}
      />
    </div>
  );
}
