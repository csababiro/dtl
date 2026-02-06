import React from "react";
import { Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  Settings, 
  Flag, 
  Wrench, 
  Image as ImageIcon, 
  Users,
  LogOut,
  ChevronRight
} from "lucide-react";

export const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Panou", icon: LayoutDashboard, path: "/admin" },
    { name: "Calendar", icon: Calendar, path: "/admin/calendar" },
    { name: "Programări", icon: ClipboardList, path: "/admin/appointments" },
    { name: "Cereri Ofertă", icon: FileText, path: "/admin/quotes" },
    { name: "Servicii", icon: Wrench, path: "/admin/services" },
    { name: "Conținut", icon: ImageIcon, path: "/admin/content" },
    { name: "Utilizatori", icon: Users, path: "/admin/users" },
    { name: "Feature flags", icon: Flag, path: "/admin/feature-flags" },
    { name: "Setări", icon: Settings, path: "/admin/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

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
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                  isActive(item.path) 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
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
          to="/admin/login" 
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Ieșire</span>
        </Link>
      </div>
    </aside>
  );
};
