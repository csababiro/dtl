"use client";

import { Mail, User, Shield } from "lucide-react";
import type { DummyUser } from "@/lib/dummy-users";
import { t } from "@/lib/i18n";

function formatDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

interface AdminUsersClientProps {
  users: DummyUser[];
}

export function AdminUsersClient({ users }: AdminUsersClientProps) {
  return (
    <div className="md:bg-white md:rounded-3xl md:border md:border-slate-100 md:shadow-sm overflow-hidden">
      {/* Mobile: separate cards with space (no outer card), larger to fill space */}
      <div className="md:hidden space-y-4 p-2 sm:p-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <User size={24} className="text-slate-600" />
              </div>
              <span className="font-bold text-slate-900 text-lg">{user.name}</span>
            </div>
            <a
              href={`mailto:${user.email}`}
              className="text-blue-600 hover:underline flex items-center gap-2 text-base"
            >
              <Mail size={18} />
              {user.email}
            </a>
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
                  user.role === "Super Admin"
                    ? "bg-purple-100 text-purple-700"
                    : user.role === "Admin"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                }`}
              >
                <Shield size={16} />
                {user.role}
              </span>
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${
                  user.active
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {user.active ? "Activ" : "Inactiv"}
              </span>
            </div>
            <p className="text-slate-600 text-sm pt-3 border-t border-slate-100">
              Ultima autentificare: {formatDate(user.lastLogin)}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Utilizator
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Email
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Rol
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Ultima autentificare
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <User size={20} className="text-slate-600" />
                    </div>
                    <span className="font-bold text-slate-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <a
                    href={`mailto:${user.email}`}
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <Mail size={16} />
                    {user.email}
                  </a>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      user.role === "Super Admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "Admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Shield size={14} />
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      user.active
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {user.active ? "Activ" : "Inactiv"}
                  </span>
                </td>
                <td className="px-6 py-5 text-slate-600 text-sm">
                  {formatDate(user.lastLogin)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
