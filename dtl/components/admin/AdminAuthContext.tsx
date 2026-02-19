"use client";

import { createContext, useContext } from "react";

export type AdminAuthValue = {
  role: string;
  sub: string;
  canManageUsers: boolean;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({
  value,
  children,
}: {
  value: AdminAuthValue;
  children: React.ReactNode;
}) {
  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthValue | null {
  return useContext(AdminAuthContext);
}
