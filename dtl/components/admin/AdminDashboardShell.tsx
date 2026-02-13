"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      {/* Mobile: top bar with menu and title */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-slate-900 text-white z-[80] flex items-center px-4 gap-3 shadow-md">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Deschide meniu"
        >
          <Menu size={24} />
        </button>
        <span className="font-semibold text-lg">DTL Admin</span>
      </div>
      {/* Content area: on desktop (lg) use margin-left so it never goes under the fixed sidebar */}
      <div className="pt-14 lg:pt-0 lg:ml-64 min-h-screen">
        <main className="w-full min-h-screen p-4 md:p-8 lg:px-10 lg:py-8 xl:px-12 xl:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
