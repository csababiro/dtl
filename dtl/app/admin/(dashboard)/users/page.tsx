import { t } from "@/lib/i18n";
import { DUMMY_USERS } from "@/lib/dummy-users";
import { Mail, User, Shield } from "lucide-react";

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

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          {t("admin.users")}
        </h1>
        <p className="text-slate-500 mt-1">
          Listă utilizatori (date dummy, fără API).
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
              {DUMMY_USERS.map((user) => (
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
    </div>
  );
}
