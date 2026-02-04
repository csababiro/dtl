"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { getSession, clearSession, isTechnician, type AdminSession } from "@/lib/auth";
import { getNamespace } from "@/lib/i18n";

function getServerSnapshot(): AdminSession | null {
  return null;
}

function getClientSnapshot(): AdminSession | null {
  return getSession();
}

function subscribe(callback: () => void): () => void {
  void callback;
  return () => {};
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const admin = getNamespace("admin");

  useEffect(() => {
    const isLoginPage = pathname === "/admin/login";
    if (isLoginPage) return;
    if (!session) {
      router.replace("/admin/login");
      return;
    }
  }, [session, pathname, router]);

  const handleLogout = () => {
    clearSession();
    router.replace("/admin/login");
  };

  const isLoginPage = pathname === "/admin/login";
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!session) {
    return null;
  }

  const technician = isTechnician(session);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-200 bg-white px-4 py-3">
        <nav className="flex flex-wrap items-center gap-4">
          {!technician && (
            <>
              <Link href="/admin" className="font-medium text-zinc-900 hover:text-zinc-600">
                {admin.dashboard}
              </Link>
              <Link href="/admin/calendar" className="text-zinc-600 hover:text-zinc-900">
                {admin.calendar}
              </Link>
              <Link href="/admin/appointments" className="text-zinc-600 hover:text-zinc-900">
                {admin.appointments}
              </Link>
              <Link href="/admin/settings" className="text-zinc-600 hover:text-zinc-900">
                {admin.settings}
              </Link>
              <Link href="/admin/feature-flags" className="text-zinc-600 hover:text-zinc-900">
                {admin.featureFlags}
              </Link>
              <Link href="/admin/services" className="text-zinc-600 hover:text-zinc-900">
                {admin.services}
              </Link>
              <Link href="/admin/users" className="text-zinc-600 hover:text-zinc-900">
                {admin.users}
              </Link>
              <Link href="/admin/content" className="text-zinc-600 hover:text-zinc-900">
                {admin.content}
              </Link>
            </>
          )}
          {technician && (
            <Link href="/admin/calendar" className="font-medium text-zinc-900 hover:text-zinc-600">
              {admin.calendar}
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="ml-auto text-zinc-600 hover:text-zinc-900"
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
