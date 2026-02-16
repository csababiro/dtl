"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  FileText,
  Settings,
  Flag,
  Wrench,
  Users,
  UsersRound,
  LogOut,
  ChevronRight,
  Image as ImageIcon,
  MessageCircle,
  Clock,
  X,
  BookOpen,
} from "lucide-react";
import { t } from "@/lib/i18n";

type AuthRole = "super_admin" | "admin" | "staff" | null;

const ALL_MENU_ITEMS: { nameKey: string; icon: React.ComponentType<{ size?: number }>; path: string }[] = [
  { nameKey: "admin.dashboard", icon: LayoutDashboard, path: "/admin" },
  { nameKey: "admin.featureFlags", icon: Flag, path: "/admin/feature-flags" },
  { nameKey: "admin.calendar", icon: Calendar, path: "/admin/calendar" },
  { nameKey: "admin.appointments", icon: ClipboardList, path: "/admin/appointments" },
  { nameKey: "admin.quotes", icon: FileText, path: "/admin/quotes" },
  { nameKey: "admin.services", icon: Wrench, path: "/admin/services" },
  { nameKey: "admin.clients", icon: UsersRound, path: "/admin/clients" },
  { nameKey: "admin.users", icon: Users, path: "/admin/users" },
  { nameKey: "admin.gallery", icon: ImageIcon, path: "/admin/gallery" },
  { nameKey: "admin.testimonials", icon: MessageCircle, path: "/admin/testimonials" },
  { nameKey: "admin.orar", icon: Clock, path: "/admin/orar" },
  { nameKey: "admin.settings", icon: Settings, path: "/admin/settings" },
  { nameKey: "admin.apiDocs", icon: BookOpen, path: "/admin/api-docs" },
];

function roleLabel(role: AuthRole): string {
  if (role === "super_admin") return t("admin.superAdmin");
  if (role === "admin") return t("admin.adminRole");
  if (role === "staff") return t("admin.roleStaff");
  return "—";
}

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({ mobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<AuthRole>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setRole(data?.role ?? null))
      .catch(() => setRole(null));
  }, []);

  const menuItems =
    role === "super_admin"
      ? ALL_MENU_ITEMS
      : ALL_MENU_ITEMS.filter(
          (item) => item.path !== "/admin/feature-flags" && item.path !== "/admin/users"
        );

  const isActive = (path: string) =>
    path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);

  return (
    <>
      {/* Mobile overlay */}
      {onMobileClose && (
        <div
          aria-hidden
          className={`lg:hidden fixed inset-0 bg-black/50 z-[90] transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`w-64 bg-slate-900 text-slate-400 h-screen flex flex-col fixed left-0 top-0 z-[100] transition-transform duration-200 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
      <div className="p-4 lg:p-6 flex items-center justify-between lg:justify-start gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Wrench size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-black text-xl leading-none">DTL</h1>
          <p className="text-[10px] uppercase tracking-widest font-bold">Admin Panel</p>
        </div>
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden ml-auto p-2 text-slate-400 hover:text-white rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={t("admin.closeMenu")}
          >
            <X size={24} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                onClick={onMobileClose}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-medium">{t(item.nameKey)}</span>
                </div>
                {isActive(item.path) && <ChevronRight size={16} />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-4 rounded-xl mb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
              {role === "super_admin" ? "SA" : role === "admin" ? "AD" : "ST"}
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">{roleLabel(role)}</p>
              <p className="text-[10px] text-slate-500">
                {role === "super_admin" ? "Proprietar" : role === "admin" ? "Administrator" : "Personal"}
              </p>
            </div>
          </div>
        </div>
        <Link
          href="/admin/logout"
          onClick={onMobileClose}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">{t("nav.logout")}</span>
        </Link>
      </div>
    </aside>
    </>
  );
}
