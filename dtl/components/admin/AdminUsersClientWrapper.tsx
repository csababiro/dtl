"use client";

import { useState } from "react";
import { AdminUsersClient } from "./AdminUsersClient";
import { getUsersAction } from "@/app/admin/(dashboard)/users/actions";
import type { DummyUser } from "@/lib/dummy-users";
import type { AdminUsersActions } from "./AdminUsersClient";

interface AdminUsersClientWrapperProps {
  initialUsers: DummyUser[];
  currentUserId: string;
  role: string;
  canManageUsers: boolean;
  actions: AdminUsersActions;
}

export function AdminUsersClientWrapper({
  initialUsers,
  currentUserId,
  role,
  canManageUsers,
  actions,
}: AdminUsersClientWrapperProps) {
  const [users, setUsers] = useState<DummyUser[]>(initialUsers);

  const refetch = async () => {
    const result = await getUsersAction();
    if ("data" in result) setUsers(result.data);
  };

  return (
    <AdminUsersClient
      users={users}
      canManageUsers={canManageUsers}
      currentUserId={currentUserId}
      isSuperAdmin={role === "super_admin"}
      onRefetch={refetch}
      actions={actions}
    />
  );
}
