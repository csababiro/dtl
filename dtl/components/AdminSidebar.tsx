"use client";

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
} from "lucide-react";
import { t } from "@/lib/i18n";

const menuItems: { nameKey: string; icon: React.ComponentType<{ size?: number }>; path: string }[] = [
  { nameKey: "admin.dashboard", icon: LayoutDashboard, path: "/admin" },
  { nameKey: "admin.calendar", icon: Calendar, path: "/admin/calendar" },
  { nameKey: "admin.appointments", icon: ClipboardList, path: "/admin/appointments" },
  { nameKey: "admin.quotes", icon: FileText, path: "/admin/quotes" },
  { nameKey: "admin.services", icon: Wrench, path: "/admin/services" },
  { nameKey: "admin.clients", icon: UsersRound, path: "/admin/clients" },
  { nameKey: "admin.users", icon: Users, path: "/admin/users" },
  { nameKey: "admin.featureFlags", icon: Flag, path: "/admin/feature-flags" },
  { nameKey: "admin.gallery", icon: ImageIcon, path: "/admin/gallery" },
  { nameKey: "admin.testimonials", icon: MessageCircle, path: "/admin/testimonials" },
  { nameKey: "admin.orar", icon: Clock, path: "/admin/orar" },
  { nameKey: "admin.settings", icon: Settings, path: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);

  return (
    <aside className="w-64 bg-slate-900 text-slate-400 h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Wrench size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-black text-xl leading-none">DTL</h1>
          <p className="text-[10px] uppercase tracking-widest font-bold">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
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
              AD
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">Admin DTL</p>
              <p className="text-[10px] text-slate-500">Super Admin</p>
            </div>
          </div>
        </div>
        <Link
          href="/admin/logout"
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">{t("nav.logout")}</span>
        </Link>
      </div>
    </aside>
  );
}
